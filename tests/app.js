'use strict';

var yeoman = require('yeoman-generator');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var yaml = require('yamljs');

describe('Replication Controller with no Ingress scenarios', function () {

    beforeEach(function () {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                name: 'nginx',
                namespace: 'default',
                podControllerType: 'Replication Controller',
                image: 'nginx',
                replicas: 1,
                containerPort: 80,
                servicePort: 8080,
                shouldExpose: false
            });
    });    

    it('File rc.yml is generated and properly are filled in', function () {
        assert.file(['rc.yml']);
        var rc = yaml.load('rc.yml');
        assert.equal(rc.apiVersion, 'v1');
        assert.equal(rc.kind, 'ReplicationController');
        assert.equal(rc.metadata.name, 'nginx');
        assert.equal(rc.metadata.namespace, 'default');
        assert.equal(rc.spec.replicas, 1);
        assert.equal(rc.spec.selector.app, 'nginx');
        assert.equal(rc.spec.template.metadata.labels.app, 'nginx');
        assert.equal(rc.spec.template.spec.containers[0].name, 'nginx');
        assert.equal(rc.spec.template.spec.containers[0].image, 'nginx');
    });

    it('File svc.yml is generated and properly are filled in', function () {
        assert.file(['svc.yml']);
        var svc = yaml.load('svc.yml');
        assert.equal(svc.apiVersion, 'v1');
        assert.equal(svc.kind, 'Service');
        assert.equal(svc.metadata.name, 'nginx');
        assert.equal(svc.metadata.namespace, 'default');
        assert.equal(svc.spec.ports[0].port, 8080);
        assert.equal(svc.spec.ports[0].targetPort, 80);
        assert.equal(svc.spec.selector.app, 'nginx');
    });

    it('File ing.yml is not generated', function () {
        assert.noFile(['ing.yml']);
    });

    it('File deployment.yml is not generated', function () {
        assert.noFile(['deployment.yml']);
    });    

});