use pest::Parser;
use pest_derive::Parser;
use wasm_bindgen::prelude::*;

#[derive(Parser)]
#[grammar = "grammar.pest"]
pub struct CalculatorParser;

#[wasm_bindgen]
pub fn calculate(input: String) -> Result<f64, JsValue> {
    let pairs = match CalculatorParser::parse(Rule::calculation, &input) {
        Ok(pairs) => pairs,
        Err(e) => return Err(JsValue::from_str(&e.to_string())),
    };

    let expr = pairs.into_iter().next().unwrap();
    let result = eval_expr(expr);
    Ok(result)
}

fn eval_expr(pair: pest::iterators::Pair<Rule>) -> f64 {
    match pair.as_rule() {
        Rule::expr => {
            let mut pairs = pair.into_inner().peekable();
            let mut result = eval_expr(pairs.next().unwrap());
            
            while pairs.peek().is_some() {
                let op = pairs.next().unwrap();
                let rhs = eval_expr(pairs.next().unwrap());
                
                result = match op.as_str() {
                    "+" => result + rhs,
                    "-" => result - rhs,
                    _ => unreachable!("Unknown operator in expr: {}", op.as_str()),
                };
            }
            result
        }
        Rule::term => {
            let mut pairs = pair.into_inner().peekable();
            let mut result = eval_expr(pairs.next().unwrap());
            
            while pairs.peek().is_some() {
                let op = pairs.next().unwrap();
                let rhs = eval_expr(pairs.next().unwrap());
                
                result = match op.as_str() {
                    "*" => result * rhs,
                    "/" => {
                        if rhs == 0.0 {
                            panic!("Division by zero");
                        }
                        result / rhs
                    },
                    _ => unreachable!("Unknown operator in term: {}", op.as_str()),
                };
            }
            result
        }
        Rule::factor => {
            let mut pairs = pair.into_inner().peekable();
            let mut result = eval_expr(pairs.next().unwrap());
            
            while pairs.peek().is_some() {
                let op = pairs.next().unwrap();
                let rhs = eval_expr(pairs.next().unwrap());
                
                result = match op.as_str() {
                    "^" => result.powf(rhs),
                    _ => unreachable!("Unknown operator in factor: {}", op.as_str()),
                };
            }
            result
        }
        Rule::number => pair.as_str().parse::<f64>().unwrap(),
        _ => unreachable!("Unexpected rule: {:?}", pair.as_rule()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_operations() {
        assert_eq!(calculate("2+2".to_string()).unwrap(), 4.0);
        assert_eq!(calculate("4-2".to_string()).unwrap(), 2.0);
        assert_eq!(calculate("3*4".to_string()).unwrap(), 12.0);
        assert_eq!(calculate("8/2".to_string()).unwrap(), 4.0);
        assert_eq!(calculate("2^3".to_string()).unwrap(), 8.0);
    }

    #[test]
    fn test_complex_expressions() {
        assert_eq!(calculate("2+3*4".to_string()).unwrap(), 14.0);
        assert_eq!(calculate("(2+3)*4".to_string()).unwrap(), 20.0);
        assert_eq!(calculate("2^3+4".to_string()).unwrap(), 12.0);
    }
} 