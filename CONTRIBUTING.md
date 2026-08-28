# Contributing

## Issues

Issues are very valuable to this project.

- Ideas are a valuable source of contributions others can make
- Problems show where this project is lacking, to help with resolving you should detail how a problem can be reproduced
- With a question you show where contributors can improve the user experience

Thank you for creating them.

## Pull Requests

Pull requests are a great way to improve this repository. When creating a pull request consider the following:

### Does it state intent

You should be clear which problem you're trying to solve with your contribution.

Be sure to detail:

- What is the problem you are trying to solve?
- How does the change solve this problem?
- Are there any shortcomings of the proposed change? Why are these shortcomings acceptable?

### Is the change of good quality

- Has a changeset been added describing the change?
  ```
  npx changeset add
  ```
- Are CI jobs still passing (build eslint, prettier, tests)?
  ```
  npm run lint
  npm run prettier
  npm test
  npm run test:integration
  ```
- Has backwards compatibility been considered?
- Have changes to public APIs been thought out? Are they useful to consumers? Are they documented?
- Were additional tests added to cover bug fixes or new code?
