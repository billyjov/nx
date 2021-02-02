import { readJson, readWorkspaceConfiguration, Tree } from '@nrwl/devkit';
import { reactVersion } from '../../utils/versions';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import reactInitGenerator from './init';
import { InitSchema } from './schema';

describe('init', () => {
  let tree: Tree;
  let schema: InitSchema = {
    unitTestRunner: 'jest',
    e2eTestRunner: 'cypress',
    skipFormat: false,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add react dependencies', async () => {
    await reactInitGenerator(tree, schema);
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.dependencies['react']).toBeDefined();
    expect(packageJson.dependencies['react-dom']).toBeDefined();
    expect(packageJson.devDependencies['@types/react']).toBeDefined();
    expect(packageJson.devDependencies['@types/react-dom']).toBeDefined();
    expect(packageJson.devDependencies['@testing-library/react']).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      await reactInitGenerator(tree, schema);
      const workspace = readWorkspaceConfiguration(tree);
      expect(workspace.cli.defaultCollection).toEqual('@nrwl/react');
      expect(workspace.generators['@nrwl/react'].application.babel).toBe(true);
    });
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await reactInitGenerator(tree, { ...schema, unitTestRunner: 'none' });
    expect(tree.exists('jest.config.js')).toEqual(false);
  });
});