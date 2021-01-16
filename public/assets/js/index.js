let ctx = document.getElementById('myChart');
let ctx2 = document.getElementById('myChart2');
let merClock = document.getElementById("imageMerge")
let merModClock = document.getElementById("imageMergeMod")
merClock.style.display = "none";
merModClock.style.display = "none";

const sortValues = (arr) => {
    let n = arr.length;
    for (let i = 0, j = n - 1; i < j; i++, j--) {
        let min = parseInt(arr[i].x),
            max = parseInt(arr[i].x);
        let min_i = i,
            max_i = i;
        for (let k = i; k <= j; k++) {
            if (parseInt(arr[k].x) > max) {
                max = parseInt(arr[k].x);
                max_i = k;
            } else if (parseInt(arr[k].x) < min) {
                min = parseInt(arr[k].x);
                min_i = k;
            }
        }

        // shifting the min. 
        [arr[i], arr[min_i]] = [arr[min_i], arr[i]]

        // Shifting the max. The equal condition 
        // happens if we shifted the max to arr[min_i]  
        // in the previous swap. 
        if (parseInt(arr[min_i].x) == max) {
            [arr[j], arr[min_i]] = [arr[min_i], arr[j]]
        } else {
            [arr[j], arr[max_i]] = [arr[max_i], arr[j]]
        }
    }
    return arr
}

mergeValues = []
mergeNewValues = []

const makeLables = (max) => {
    if (max == "") {
        return []
    }
    let lable = []
    for (let i = 0; i <= max;) {
        lable.push(i.toString());
        if (max <= 100) {
            i += max / 5
        } else {
            i += max / 10;
        }
    }
    return lable
}

const doLogic = () => {
    merClock.style.display = "block";
    merModClock.style.display = "block";
    let maxValue = document.getElementById('maxValue').value;
    let minValue = document.getElementById('minValue').value;
    let totalSize = document.getElementById('totalSize').value;
    if (maxValue == '' || minValue == '' || totalSize == '') {
        alert("Kindly Fill all the required Field :)")
        return;
    }
    data = {
        min: minValue,
        max: maxValue,
        total: totalSize
    }
    $.ajax({
            type: 'post',
            url: '/merge',
            async: true,
            data: data,
            dataType: 'text'
        })
        .done(function (data) {
            data = JSON.parse(data);
            merClock.style.display = "none";
            document.getElementById('merSec').innerText = data.sec + "s " + data.ms + "ms";
            mergeValues.push({
                x: parseInt(totalSize),
                y: parseFloat(data.sec) + (parseFloat(data.ms) / 1000)
            })
        });
        $
    $.ajax({
            type: 'post',
            url: '/modmerge',
            async: true,
            data: data,
            dataType: 'text'
        })
        .done(function (data) {
            data = JSON.parse(data);
            merModClock.style.display = "none";
            document.getElementById('newMerSec').innerText = data.sec + "s " + data.ms + "ms";
            mergeNewValues.push({
                x: parseInt(totalSize),
                y: parseFloat(data.sec) + (parseFloat(data.ms) / 1000)
            })
            mergeValues = sortValues(mergeValues)
            mergeNewValues = sortValues(mergeNewValues)

            var myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: makeLables(totalSize),
                    datasets: [{
                        label: "Merge Sort",
                        data: mergeValues
                    }]
                }
            });
            var myLineChart = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: makeLables(totalSize),
                    datasets: [{
                        label: "Modified Sort",
                        data: mergeNewValues
                    }]
                }
            });
            console.log(mergeValues)
            console.log(mergeNewValues)

        });


}