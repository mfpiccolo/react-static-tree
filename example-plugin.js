const _ = require('lodash');
const fs = require('fs');
const docGen = require('react-docgen');

const components = [];

module.exports = function(babel) {
  const t = babel.types;
  return {
    inherits: require('babel-plugin-syntax-jsx'),
    pre(state) {
      this.isReact = null;
      this.exportedComponent = null;
      this.renderedTagComponents = [];
      this.possibleImportedComponents = [];
      this.possibleImportedComponentsWithPath = [];
    },
    visitor: {
      Identifier(path) {
        const name = path.node.name;
        if (isPossibleImportedComponent(path)) {
          this.possibleImportedComponents.push(name);
        }

        const parentType = _.get(path, 'parent.type');

        // checks if the source is importing react
        if (parentType == 'ExportDefaultDeclaration') {
          this.exportedComponent = name;
        }
        if (
          _.get(path, 'parent.type') == 'ImportDefaultSpecifier' &&
          name === 'React'
        ) {
          this.isReact = true;
        }
      },
      JSXIdentifier(path) {
        if (!this.isReact) return;
        if (isRenderedTabComponent(path)) {
          this.renderedTagComponents.push(path.node.name);
        }
      },
      ImportDeclaration(path) {
        if (!this.isReact) return;
        // console.log(path);
      },
      ExportDefaultDeclaration(path) {
        if (!this.isReact) return;
        const className = _.get(path, 'node.declaration.id.name');
        if (!this.exportedComponent && className) {
          this.exportedComponent = className;
        }
      },
      Literal(path) {
        if (!this.isReact) return;
        const importLiteral = path.node.value;
        const importName = _.get(path, 'parent.specifiers[0].local.name');
        if (this.possibleImportedComponents.includes(importName)) {
          this.possibleImportedComponentsWithPath.push({
            name: importName,
            path: importLiteral,
          });
        }
      },
    },
    post(state) {
      confirmedComponents = _.compact(
        this.possibleImportedComponents.map(component => {
          const isConfirmed = this.renderedTagComponents.includes(component);
          if (isConfirmed) {
            return this.possibleImportedComponentsWithPath.find(
              cWithPath => cWithPath.name === component
            );
          }
        })
      );

      console.log({
        file: state.opts.filename,
        componentName: this.exportedComponent,
        renderedTagComponents: this.renderedTagComponents,
        possibleImportedComponents: this.possibleImportedComponents,
        possibleImportedComponentsWithPath: this
          .possibleImportedComponentsWithPath,
        confirmedComponents,
      });
    },
  };
};

function isRenderedTabComponent(path) {
  const name = path.node.name;
  const isTag = _.get(path, 'parent.type') === 'JSXOpeningElement';
  return isTag && isCapitalized(name[0]);
}

function isPossibleImportedComponent(path) {
  const name = path.node.name;
  if (['React', 'PropTypes'].includes(name)) return;
  const isTag = _.get(path, 'parent.type') === 'ImportDefaultSpecifier';
  return isTag && isCapitalized(name[0]);
}

function isCapitalized(string) {
  firstChar = string[0];
  return firstChar.charCodeAt() <= 90 && firstChar.charCodeAt() >= 65;
}
