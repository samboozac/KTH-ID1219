/* eslint-env mocha */
'use strict'
const expect = require('chai').expect
const unpackMongodbConfig = require('../lib/unpackMongodbConfig')

const testURI = 'mongodb://username@email.com:password@mongohost:27017/innovation?ssl=false'
const testAzureURI = 'mongodb://username:password@url.documents.azure.com:10255/project?ssl=true'
const failAzureURI = 'mongodb://username:password@url.documents.azure.com:10255?ssl=true'
const failProtocol = 'http://mongohost:27017/innovation'

describe('unpackMongodbConfig', function () {
  it('can decode a Mongodb URI from fallback URI', function () {
    const obj = unpackMongodbConfig('no-env-exists', testURI)
    expect(obj.username).to.equal('username@email.com')
    expect(obj.password).to.equal('password')
    expect(obj.uri).to.equal(testURI)
    expect(obj.ssl).to.equal(false)
  })

  it('can decode a Mongodb URI from env var', function () {
    process.env['TEST_ENV_NOW_HERE'] = testURI
    const obj = unpackMongodbConfig('TEST_ENV_NOW_HERE')
    expect(obj.username).to.equal('username@email.com')
    expect(obj.password).to.equal('password')
    expect(obj.uri).to.equal(testURI)
    expect(obj.ssl).to.equal(false)
  })

  it('can decode a Mongodb URI from fallback URI and merge with options', function () {
    const obj = unpackMongodbConfig('no-env-exists', testURI, { extraOption: true })
    expect(obj.username).to.equal('username@email.com')
    expect(obj.password).to.equal('password')
    expect(obj.uri).to.equal(testURI)
    expect(obj.ssl).to.equal(false)
    expect(obj.extraOption).to.equal(true)
  })

  it('can decode a cosmos db connection string', function () {
    const obj = unpackMongodbConfig('no-env-exists', testAzureURI)
    expect(obj.username).to.equal('username')
    expect(obj.password).to.equal('password')
    expect(obj.host).to.equal('url.documents.azure.com:10255')
    expect(obj.db).to.equal('project')
    expect(obj.uri).to.equal(testAzureURI)
    expect(obj.ssl).to.equal(true)
  })

  it('can decode a url without dbname', function () {
    const obj = unpackMongodbConfig('no-env-exists', failAzureURI)
    expect(obj.username).to.equal('username')
    expect(obj.password).to.equal('password')
    expect(obj.host).to.equal('url.documents.azure.com:10255')
    expect(obj.db).to.equal(null)
    expect(obj.uri).to.equal(failAzureURI)
    expect(obj.ssl).to.equal(true)
  })

  it('should not expose protocol property', function () {
    const obj = unpackMongodbConfig('no-env-exists', testURI)
    expect(obj.protocol).to.equal(undefined)
  })

  it('should not accept wrong protocol', function () {
    var theErr
    try {
      unpackMongodbConfig('no-env-exists', failProtocol)
    } catch (err) {
      theErr = err
    }
    expect(theErr).not.to.equal(undefined)
  })
})
