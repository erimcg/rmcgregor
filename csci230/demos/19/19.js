
/*
Web Workers do not have access to the DOM, can share SharedArrayBuffer.
Workers work in separate thread from main browser thread.

3 types of Web Workers
- dedicated web worker: are backgrounds script run from a single web page
- shared web workers: can be accessed by multiple pages' scripts from same 
    origin as page that spawned it.
- service workers: acts as network request arbiter capable of intercepting,
    redirecting and modify requests dispatched by the page

Workers don't have access to a Window object, but have access to 
a subclass of WorkerGlobalScope.  Each instance is accessed
via an object named self. self contains a subset of Window's properties.

*/

const worker = new Worker('./workers/dedicated.js')
console.log(worker)

worker.addEventListener('message', receiveMessage)

worker.addEventListener('error', (e) => {
    console.log("page: worker dispatched error event")
})

worker.addEventListener('messageerror', (e) => {
    console.log("page: worker sent message but messange can't be deserialized")
})

function postMessage() {
    console.log('page: sending message to worker')
    worker.postMessage('FETCH_DATA')
}

function haltWorker() {
    console.log("page: shutting down worker");
    worker.terminate()
}

function receiveMessage(e) {
    switch (e.data) {
        case 'TERMINATING':
            console.log('page: received termination message')
            break;
        default:
            console.log("page: received data from worker")
            console.log(e.data)

            const section = document.querySelector('section')
            const elm = document.createElement('div')
            elm.innerText = e.data
            section.appendChild(elm)
    }
}


document.addEventListener('visibilitychange', (e) => {
    if (document.visibilityState == 'hidden') {
        //terminate the worker when the user navigates to another page
        //console.log("page: shutting down worker");
        //worker.terminate()
    }
})
