var _ = require('lodash');

module.exports = function(babel) {
  var t = babel.types;
  return {
    inherits: require('babel-plugin-syntax-jsx'),
    pre(state) {
      this.isReact = null;
      this.exportedComponent = null;
      this.renderedTagComponents = [];
      this.possibleComponents = [];
      this.possibleComponentsWithPath = [];
    },
    visitor: {
      Identifier(path) {
        var name = path.node.name;
        if (isPossibleImportedComponent(path)) {
          this.possibleComponents.push(name);
        }

        var parentType = _.get(path, 'parent.type');

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
        var className = _.get(path, 'node.declaration.id.name');
        if (!this.exportedComponent && className) {
          this.exportedComponent = className;
        }
      },
      Literal(path) {
        if (!this.isReact) return;
        const importLiteral = path.node.value;
        const importName = _.get(path, 'parent.specifiers[0].local.name');
        if (this.possibleComponents.includes(importName)) {
          this.possibleComponentsWithPath.push({
            name: importName,
            path: importLiteral,
          });
        }
      },
    },
    post(state) {
      confirmedComponents = this.possibleComponents.filter(component => {
        return this.renderedTagComponents.includes(component);
      });
      console.log({
        file: state.opts.filename,
        componentName: this.exportedComponent,
        renderedTagComponents: this.renderedTagComponents,
        possibleComponents: this.possibleComponents,
        possibleComponentsWithPath: this.possibleComponentsWithPath,
        confirmedComponents,
      });
    },
  };
};

function isRenderedTabComponent(path) {
  var name = path.node.name;
  var isTag = _.get(path, 'parent.type') === 'JSXOpeningElement';
  return isTag && isCapitalized(name[0]);
}

function isPossibleImportedComponent(path) {
  var name = path.node.name;
  if (['React', 'PropTypes'].includes(name)) return;
  var isTag = _.get(path, 'parent.type') === 'ImportDefaultSpecifier';
  return isTag && isCapitalized(name[0]);
}

function isCapitalized(string) {
  return string === string.toUpperCase();
}
