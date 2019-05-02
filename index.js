const fs = require('fs')

// our goal is to use callbacks to read the contents of several files and print all to a single output file using the Node fs module

/* ------------------------------------------------------------- */

// step 1 - setup
// take promisifyDemo
// echo 'avocado' > file1.txt
// echo 'queso' > file2.txt
// echo 'soup' > file3.txt
// touch index.js
// code . 

/* ------------------------------------------------------------- */

// step 2 - "callback hell"
// do not modularize, repeat code
// test code
// add .toString() to data repsonse, it comes back as hex
// test code again 

let results = []

fs.readFile('file1.txt', (err, data) => {
  if(err){
    console.log('err', err)
    return
  }
  results.push(data)

  fs.readFile('file2.txt', (err, data) => {
    if(err) {
      console.log('err', err)
      return
    }
    results.push(data)

    fs.readFile('file3.txt', (err, data) => {
      if(err) {
        console.log('err', err)
        return
      }
      results.push(data)

      fs.writeFile('results.txt', results.join(''), (err) => {
        if(err) console.log(err)
        return 
      })
    })

  })
})

/* ------------------------------------------------------------- */

// Turn and Talk - what is wrong with this code? it works but what is wrong? 

/* ------------------------------------------------------------- */

// step 3 - refactor: "SRP" 
// pull out fs.writeFile into a function called combineFiles

let results = []

fs.readFile('file1.txt', (err, data) => {
  if(err){
    console.log('err', err)
    return
  }
  results.push(data)

  fs.readFile('file2.txt', (err, data) => {
    if(err) {
      console.log('err', err)
      return
    }
    results.push(data)

    fs.readFile('file3.txt', (err, data) => {
      if(err) {
        console.log('err', err)
        return
      }
      results.push(data)

      combineFiles('results.txt', results)
    })

  })
})

const combineFiles = (fileName, fileData) => {
  fs.writeFile(fileName, fileData.join(''), (err) => {
    if(err) console.log(err)
    return 
  })
}

/* ------------------------------------------------------------- */

// step 4 - promisify 
// refactor: "DRY" 
// pull out fs.readFile into a function called readFile that returns a new Promise
// still kind of callback hell, just .then() callback hell

let results = []

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if(err){
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

const combineFiles = (fileName, fileData) => {
  fs.writeFile(fileName, fileData.join(''), (err) => {
    if(err) console.log(err)
    return 
  })
}

getFile('file1.txt')
.then(data => {
  results.push(data)
  getFile('file2.txt')
  .then(data => {
    results.push(data)
    getFile('file3.txt')
    .then(data => {
      results.push(data)
      combineFiles('results.txt', results)
    })
  })
})
.catch(err => err)

/* ------------------------------------------------------------- */

// step 5 - get out of callback hell 
// pull out hard coded file names to live in an array 
// use Promise.all() to resolve array of promises created my mapping over files array 

const files = ['file1.txt', 'file2.txt', 'file3.txt']

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if(err){
        reject(err)
        return 
      }
      resolve(data)
    })
  })
}

const combineFiles = (fileName, fileData) => {
  fs.writeFile(fileName, fileData.join(''), (err) => {
    if(err) console.log(err)
    return 
  })
}

Promise.all(files.map(getFile))
  .then(fileData => combineFiles('results.txt', fileData))

/* ------------------------------------------------------------- */

// step 6 - nightmare mode 
// refactor files to be pulled from command line execution process args
// process.argv global node variable created when file is run 
// use rest operator and desctructuring to gather file names from process args
// now run file with: node index.js <outputFile.txt> <fileName1.txt> <fileName2.txt>

let [node, file, outputFile, ...files] = process.argv

const getFile = (fileName) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if(err){
        reject(err)
        return 
      }
      resolve(data)
    })
  })
}

const combineFiles = (fileName, fileData) => {
  fs.writeFile(fileName, fileData.join(''), (err) => {
    if(err) console.log(err)
    return 
  })
}

Promise.all(files.map(getFile))
  .then(fileData => combineFiles(outputFile, fileData))


