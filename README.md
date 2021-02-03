# NodeJS Immersion by #NodeBR

NodeJS immersion by [@nodebr](https://github.com/nodebr) and [@erickwendel](https://github.com/ErickWendel).

Link of this [free course](https://erickwendel.teachable.com/p/node-js-para-iniciantes-nodebr?origin=CursoErickWendel), in case you want to reproduce what is here.

## Lerna

This mono-repo is managed by lerna and yarn workspaces, and you can use the following scripts to install all the dependencies

```bash
yarn
```

## Running all tests of all packages

```bash
lerna run test
```

## Installing dependencies from the same mono-repo

In the folder of the package you want to install the dependency, just run

```bash
lerna add <package_name>
```

Fell free to contact me if you have any questions.
