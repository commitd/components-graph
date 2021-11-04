<h1 align="center"> Components Graph </h1>
<br>
<p align="center">
  <img src="https://committed.io/Logo.svg" width="128px" alt="Project Logo"/>
</p>
<p align="center">
  Committed Software Graph Component
</p>

[![Committed Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fcommitted.io%2Fbadge)](https://committed.io)
![Build Status](https://github.com/commitd/components-graph/workflows/build/badge.svg?branch=main)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=commitd_components-graph&metric=alert_status&token=aa002ca75e2f3a6d028af9074bceeda1ffa2f9f7)](https://sonarcloud.io/dashboard?id=commitd_components-graph)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=commitd_components-graph&metric=coverage&token=aa002ca75e2f3a6d028af9074bceeda1ffa2f9f7)](https://sonarcloud.io/dashboard?id=commitd_components-graph)
![GitHub repo size](https://img.shields.io/github/repo-size/commitd/components-graph)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A graph visualisation. It supports custom decoration, different layouts and user interactions.

## Commands

Install dependencies with

```bash
npm install
```

Build the modules

```bash
npm run build
```

This builds to the relevant `/dist` folders.

### Modules

The project is published as `@committed/components-graph` but is further separated into modules so the non-ui code can be used in the backend.

- `@committed/graph` - contains the graph models, types and API
- `@committed/component-graph-react` - contains the react specific UI components

### Storybook

To view a storybook of the components, run:

```bash
npm run storybook
```

### Example

There is also an example project that uses the graph:

```bash
cd example
npm install
npm run start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component. **No symlinking required**, we use [Parcel's aliasing](https://parceljs.org/module_resolution.html#aliases).

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm run test` and `testing-library`.

#### React Testing Library

Import `test/setup` in your test files to use `react-testing-library`.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Publishing to NPM

Publish is handled by `semantic-release` use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). Use `npm run commit` for helper.
