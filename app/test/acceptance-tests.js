var By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    firefox = require('selenium-webdriver/firefox'),
    assert = require('assert');

var firefoxDriver = new firefox.Driver();

//google example
firefoxDriver.get('http://www.google.com/ncr');
firefoxDriver.findElement(By.name('q')).sendKeys('webdriver');
firefoxDriver.findElement(By.name('btnG')).click();
firefoxDriver.wait(until.titleIs('webdriver - Google Search'), 1000);


//login
firefoxDriver.get('http://localhost:8081/connect');
firefoxDriver.findElement(By.id('username')).sendKeys('modd1');
firefoxDriver.findElement(By.id('password')).sendKeys('passmod1');
firefoxDriver.findElement(By.id('loginButton')).click().then(function(value) {

    firefoxDriver.executeScript("return $('#username').val()").then(function(return_value) {
        assert.equal(return_value, "modd1");
    });
});

firefoxDriver.quit();