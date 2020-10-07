[![Build Status](http://rk-sragen.site:8080/buildStatus/icon?job=Forsix)](http://rk-sragen.site:8080/job/Forsix/)

# Forsix-Analyzer

This is the script branch of the system, which means you can run this without docker. Configure the *artifact.json* file first to your needs.
particularly the *test_folder* and *target_log* property.

To run this, simply execute

    $ npm start

This requires the user to input the path to the directory that they wish to watch, and the logfile that will log those events.

# Technical Details

Well, to put it simply, all you need to do is.

`var listener = require("./file_listener").listener`

Put that code into your *Node.js* code, and the listener is now ready to use.


To start listening, the *listener* is a *Class* that upon construction, would require two arguments

***1. Directory***

  *this is pretty much self explanatory.*
  
***2. Logfile***

  *this will be the module's logging file.*
  
To invoke the *listener*, you can do the following:

`var newListener = new listener("C:\\foo","bar.txt")`

Taking the previously made, `listener` Class, we would now create a new `listener` instance.
Thankfully, most of the processeses inside the module are done *Asynchronously*, which means multiple instances of listener should be a ok.

Now that we have the `listener` instance ready, we can use the `listen()` method that the `listener` instance has, and use it to listen to the specified directory. Like this:

`newListener.listen()`

And that's it, listener would now be running on the specified directory.

The *logfile* will be created on the current working directory or *cwd* in short, you can view the cwd of the app by using `process.cwd()`.

# Additional Tips
  ***1. It's recommended to use `Promise` to wrap the listener in case something went wrong. Since the listener would run `Asynchronously`***
  
  ***2. Make sure to use `setTimeout()` before running another instance of `listener`, this is to reduce the chance of race condition problems.***





