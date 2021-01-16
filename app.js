const express = require('express')
var bodyParser = require('body-parser');

const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const getRandomArray = (min, max, total) => {
    return Array.from({
        length: total
    }, () => Math.floor(Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min)));
}
const merge = (arr1, arr2) => {
    let sorted = [];

    while (arr1.length && arr2.length) {
        if (arr1[0] < arr2[0]) sorted.push(arr1.shift());
        else sorted.push(arr2.shift());
    };

    return sorted.concat(arr1.slice().concat(arr2.slice()));
};
const mergeSort = arr => {
    if (arr.length <= 1) return arr;
    let mid = Math.floor(arr.length / 2),
        left = mergeSort(arr.slice(0, mid)),
        right = mergeSort(arr.slice(mid));
    return merge(left, right);
};

function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0, j = n - 1; i < j; i++, j--) {
        let min = arr[i],
            max = arr[i];
        let min_i = i,
            max_i = i;
        for (let k = i; k <= j; k++) {
            if (arr[k] > max) {
                max = arr[k];
                max_i = k;
            } else if (arr[k] < min) {
                min = arr[k];
                min_i = k;
            }
        }
        [arr[i], arr[min_i]] = [arr[min_i], arr[i]]
        if (arr[min_i] == max) {
            [arr[j], arr[min_i]] = [arr[min_i], arr[j]]
        } else {
            [arr[j], arr[max_i]] = [arr[max_i], arr[j]]
        }
    }
}
const newMergeSort = arr => {
    if (arr.length <= 50) {
        selectionSort(arr)
        return;
    };
    let mid = Math.floor(arr.length / 2),
        left = mergeSort(arr.slice(0, mid)),
        right = mergeSort(arr.slice(mid));
    return merge(left, right);
};


app.get('/', (req, res) => {
    res.render('index');
})

let arr;
app.post('/merge', (req, res) => {
    let minValue = parseInt(req.body.min);
    let maxValue = parseInt(req.body.max);
    let totalSize = parseInt(req.body.total);
    arr = getRandomArray(minValue, maxValue, totalSize)
    var hrstart = process.hrtime()
    tempArr = mergeSort(arr)
    hrend = process.hrtime(hrstart)
    return res.json({
        sec: hrend[0],
        ms: hrend[1] / 1000000
    })
});

app.post('/modmerge', (req, res) => {
    var hrstart = process.hrtime()
    tempArr = newMergeSort(arr)
    hrend = process.hrtime(hrstart)
    return res.json({
        sec: hrend[0],
        ms: hrend[1] / 1000000
    })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})