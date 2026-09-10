/**
 * Safe Mathematical Expression Evaluator
 *
 * Requirements:
 * - NO eval()
 * - NO new Function()
 * - Pure deterministic tokenizer + AST / Shunting-Yard evaluator
 * - Whitelisted operators: +, -, *, /, ^, %
 * - Whitelisted functions: sqrt, sin, cos, tan, abs, ln, log10, pi
 * - Domain validation (division by zero, negative sqrt, range bounds)
 */

export interface EvaluationResult {
  value: number;
  error?: string;
  isValid: boolean;
}

export interface VariableDomain {
  min?: number;
  max?: number;
}

export class SafeFormulaEvaluator {
  private static readonly OPERATORS: Record<string, { precedence: number; assoc: "L" | "R" }> = {
    "+": { precedence: 2, assoc: "L" },
    "-": { precedence: 2, assoc: "L" },
    "*": { precedence: 3, assoc: "L" },
    "/": { precedence: 3, assoc: "L" },
    "%": { precedence: 3, assoc: "L" },
    "^": { precedence: 4, assoc: "R" },
  };

  private static readonly FUNCTIONS = new Set([
    "sqrt",
    "sin",
    "cos",
    "tan",
    "abs",
    "ln",
    "log",
  ]);

  private static readonly CONSTANTS: Record<string, number> = {
    pi: Math.PI,
    e: Math.E,
  };

  /**
   * Tokenize mathematical expression into tokens
   */
  public static tokenize(expression: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    const str = expression.trim();

    while (i < str.length) {
      const char = str[i];

      // Whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers (integers or decimals)
      if (/\d/.test(char) || (char === "." && i + 1 < str.length && /\d/.test(str[i + 1]))) {
        let num = "";
        while (i < str.length && (/[\d.]/.test(str[i]))) {
          num += str[i];
          i++;
        }
        tokens.push(num);
        continue;
      }

      // Operators
      if (char in this.OPERATORS || char === "(" || char === ")" || char === ",") {
        tokens.push(char);
        i++;
        continue;
      }

      // Identifiers (variables, functions, constants)
      if (/[a-zA-Z_]/.test(char)) {
        let ident = "";
        while (i < str.length && /[a-zA-Z0-9_]/.test(str[i])) {
          ident += str[i];
          i++;
        }
        tokens.push(ident);
        continue;
      }

      throw new Error(`Invalid character in expression: '${char}'`);
    }

    return tokens;
  }

  /**
   * Convert tokens to Reverse Polish Notation (RPN) via Shunting-Yard algorithm
   */
  public static toRPN(tokens: string[]): string[] {
    const outputQueue: string[] = [];
    const operatorStack: string[] = [];

    for (let idx = 0; idx < tokens.length; idx++) {
      const token = tokens[idx];

      // Check if token is a number
      if (!isNaN(Number(token))) {
        outputQueue.push(token);
      } else if (this.FUNCTIONS.has(token.toLowerCase())) {
        operatorStack.push(token.toLowerCase());
      } else if (token === ",") {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
      } else if (token in this.OPERATORS) {
        // Handle unary minus: if at start or immediately preceded by operator or '('
        const prev = idx > 0 ? tokens[idx - 1] : null;
        const isUnary = (token === "-" || token === "+") && (!prev || prev in this.OPERATORS || prev === "(");

        if (isUnary && token === "-") {
          // Represent unary minus as a special operator '~'
          while (
            operatorStack.length > 0 &&
            operatorStack[operatorStack.length - 1] in this.OPERATORS &&
            this.OPERATORS[operatorStack[operatorStack.length - 1]].precedence >= 5
          ) {
            outputQueue.push(operatorStack.pop()!);
          }
          operatorStack.push("~");
          continue;
        }

        const o1 = token;
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] in this.OPERATORS
        ) {
          const o2 = operatorStack[operatorStack.length - 1];
          const o1Prec = this.OPERATORS[o1].precedence;
          const o2Prec = o2 === "~" ? 5 : this.OPERATORS[o2].precedence;

          if (
            (this.OPERATORS[o1].assoc === "L" && o1Prec <= o2Prec) ||
            (this.OPERATORS[o1].assoc === "R" && o1Prec < o2Prec)
          ) {
            outputQueue.push(operatorStack.pop()!);
          } else {
            break;
          }
        }
        operatorStack.push(o1);
      } else if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        if (operatorStack.length === 0) {
          throw new Error("Mismatched parentheses: missing '('");
        }
        operatorStack.pop(); // discard '('

        if (
          operatorStack.length > 0 &&
          this.FUNCTIONS.has(operatorStack[operatorStack.length - 1])
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
      } else {
        // Variable or constant identifier
        outputQueue.push(token);
      }
    }

    while (operatorStack.length > 0) {
      const op = operatorStack.pop()!;
      if (op === "(" || op === ")") {
        throw new Error("Mismatched parentheses in expression");
      }
      outputQueue.push(op);
    }

    return outputQueue;
  }

  /**
   * Evaluate expression safely with variable values and domain validation
   */
  public static evaluate(
    expression: string,
    variables: Record<string, number> = {},
    domains?: Record<string, VariableDomain>
  ): EvaluationResult {
    try {
      // 1. Validate variable domains if specified
      if (domains) {
        for (const [varName, domain] of Object.entries(domains)) {
          const val = variables[varName];
          if (val !== undefined) {
            if (domain.min !== undefined && val < domain.min) {
              return { value: 0, isValid: false, error: `Variable '${varName}' (${val}) is below minimum bound (${domain.min})` };
            }
            if (domain.max !== undefined && val > domain.max) {
              return { value: 0, isValid: false, error: `Variable '${varName}' (${val}) is above maximum bound (${domain.max})` };
            }
          }
        }
      }

      // 2. Tokenize & convert to RPN
      const tokens = this.tokenize(expression);
      const rpn = this.toRPN(tokens);
      const stack: number[] = [];

      for (const token of rpn) {
        if (!isNaN(Number(token))) {
          stack.push(Number(token));
        } else if (token in this.CONSTANTS) {
          stack.push(this.CONSTANTS[token]);
        } else if (token in variables) {
          stack.push(variables[token]);
        } else if (token === "~") {
          // Unary minus
          if (stack.length < 1) throw new Error("Invalid unary minus operation");
          stack.push(-stack.pop()!);
        } else if (token in this.OPERATORS) {
          if (stack.length < 2) throw new Error(`Operator '${token}' requires 2 operands`);
          const b = stack.pop()!;
          const a = stack.pop()!;

          switch (token) {
            case "+":
              stack.push(a + b);
              break;
            case "-":
              stack.push(a - b);
              break;
            case "*":
              stack.push(a * b);
              break;
            case "/":
              if (b === 0) {
                return { value: 0, isValid: false, error: "Division by zero is undefined" };
              }
              stack.push(a / b);
              break;
            case "%":
              if (b === 0) {
                return { value: 0, isValid: false, error: "Modulo by zero is undefined" };
              }
              stack.push(a % b);
              break;
            case "^":
              stack.push(Math.pow(a, b));
              break;
          }
        } else if (this.FUNCTIONS.has(token)) {
          if (stack.length < 1) throw new Error(`Function '${token}' requires an argument`);
          const arg = stack.pop()!;

          switch (token) {
            case "sqrt":
              if (arg < 0) {
                return { value: 0, isValid: false, error: "Cannot take square root of a negative value" };
              }
              stack.push(Math.sqrt(arg));
              break;
            case "sin":
              stack.push(Math.sin(arg));
              break;
            case "cos":
              stack.push(Math.cos(arg));
              break;
            case "tan":
              // Check for cosine near zero (π/2 + kπ)
              if (Math.abs(Math.cos(arg)) < 1e-12) {
                return { value: 0, isValid: false, error: "Tangent is undefined at odd multiples of π/2" };
              }
              stack.push(Math.tan(arg));
              break;
            case "abs":
              stack.push(Math.abs(arg));
              break;
            case "ln":
              if (arg <= 0) {
                return { value: 0, isValid: false, error: "Logarithm is only defined for positive values" };
              }
              stack.push(Math.log(arg));
              break;
            case "log":
              if (arg <= 0) {
                return { value: 0, isValid: false, error: "Logarithm is only defined for positive values" };
              }
              stack.push(Math.log10(arg));
              break;
          }
        } else {
          return {
            value: 0,
            isValid: false,
            error: `Undefined variable or disallowed identifier: '${token}'`,
          };
        }
      }

      if (stack.length !== 1) {
        return { value: 0, isValid: false, error: "Malformed expression syntax" };
      }

      const finalVal = stack[0];
      if (isNaN(finalVal) || !isFinite(finalVal)) {
        return { value: 0, isValid: false, error: "Result evaluated to non-finite number" };
      }

      return { value: finalVal, isValid: true };
    } catch (err: any) {
      return { value: 0, isValid: false, error: err.message || "Evaluation error" };
    }
  }
}
