﻿/// <reference path="code.js" />


  test("A basic test", function () {
      ok(true, "this test is fine");
      var value = "hello";
      equals("hello", value, "We expect value to be hello");
  });

  module("stringLib");

  test("will get vowel count", function () {
      var count = stringLib.vowels("hello");

      equals(count, 2, "We expect 2 vowels in hello");
  });

  module("mathLib");

  test("will add 5 to number", function () {
      var res = mathLib.add5(10)

      equals(res, 15, "should add 5");
  });

  test("will multiply 5 to number", function () {
      var res = mathLib.mult5(10)

      equals(res, 50, "should multiply by 5");
  });