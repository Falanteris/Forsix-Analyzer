[![Build Status](http://rk-sragen.site:8080/buildStatus/icon?job=Forsix)](http://rk-sragen.site:8080/job/Forsix/)

# Forsix-Analyzer


This is the dockerized version of the system. To use the pure script one, head over to the *script* branch.

Now let's get started. You can either:

1. Clone this directory, Build, and Run it yourself.

2. Pulling from docker registry and run it yourself.

## Option 1

    $ git clone https://github.com/Falanteris/forsix-analyzer.git
    $ docker build -t nethive.me/forsix .
    $ docker run -d --name forsix --rm -v /path/to/your/dir:/watchdir nethive.me/forsix

## Option 2

    $ docker login -u forsix -p analyzer nethive.me
    $ docker run -d --name forsix --rm -v /path/to/your/dir:/watchdir nethive.me/forsix

You can view logs by *tail*-ing the logfile inside the docker container.

    $ docker exec -it forsix tail -f log/entry.log

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





