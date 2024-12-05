export function domainOriginSource(arr){
    let origin = window.origin;
    let domainOriginSource = "";
    if(origin.includes("reporting.milgenx.com")){
        domainOriginSource = "https://reportingapi.milgenx.com";
    }else{
        domainOriginSource = "http://localhost:8080";   
    }
    return domainOriginSource;
}

export function sumOfColumn(arr){
    let count = 0;
    let countSumInitlizer = 0;
    arr.forEach(function(arrItem){
        count = countSumInitlizer + Number(arrItem);
        countSumInitlizer = count;
    })
    return count;
}

export function getFormattedDate(str) {
    const dateRaw = new Date(str);
    const day = dateRaw.getDate();
    const month = dateRaw.getMonth() + 1; // Months are zero-based, so add 1
    const year = dateRaw.getFullYear();

    return `${month}/${day}/${year}`;
}

export function splitColumn(arr, arraylabel) {
    // console.log(arr, arraylabel);
    let newArray = [];
    if(Array.isArray(arr) && arraylabel){
        arr.forEach(function(arrItem, index){
            let splitColumnItem = arrItem[arraylabel];
            newArray.push(splitColumnItem);
        })
        return newArray;
    }else{
        return "arraylabel to split coulmn not defined.";
    }
}

export function splitRows(arr, matchWith, arraylabel) {
    let newArray = [];
    // console.log({arr, matchWith, arraylabel})

    if(Array.isArray(arr) && arraylabel){
        arr.forEach(function(arrItem, index){
            if(arrItem[matchWith] === arraylabel){
                newArray.push(arrItem);
            }
        })
        return newArray;
    }else{
        return "arraylabel to split rows not defined.";
    }
}

export function removeDuplicates(arr) {
    return [...new Set(arr)];
}

export function sumValues(arr){
    arr.reduce((accumulator, object) => {
    return accumulator + object.salary;
    }, 0);
}

export function parseDate(date){
    let dateValue = new Date(date);
    console.log({dateValue})
    if(date){
        let parsedDate = '';
        let dateRaw = dateValue.toLocaleString('en-IN', {timeZone: 'IST'}).split(',')[0].split("/");
        if(dateRaw[1] === undefined){
            // Extract parts of the date
            const [month, day, year, time, period] = date.split(/[\s,]+/);

            const [hours, minutes] = time.split(":").map(Number);

            // Convert hours to 24-hour format
            // const adjustedHours = period.toLowerCase() === "pm" && hours !== 12 ? hours + 12 : hours;

            // Create a Date object
            const dateObject = new Date(`${month} ${day}, ${year}`);
            console.log({dateObject})
            return month+" "+year;
        }else{
            return parsedDate = dateRaw[1]+"/"+dateRaw[0]+"/"+dateRaw[2];
        }
    }else{
        return "";
    }
}

export function extractDate(date){
    if(date){
        return date.split('T')[0];
    }
}

export function getDaysArray(start, end) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

export function compareStrings(s1, s2){
   
    // This condition will return true only if s1 and s2 hold true from equality
    if(s1 === s2){
        return true;
    }
    
    return false;
}