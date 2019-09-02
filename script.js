var students = [];
var subjects = ['English','Kannada','Maths','Science','Social'];
var record = ['Unique ID','Name','Grade','Section','Exam Type'];

var addStudent = function () {
    var uniqueID = document.getElementById('uniqueId').value;
    var nameInput = document.getElementById('nameInput').value;
    var gradeInput = document.getElementById('gradeInput').value;
    var sectionInput = document.getElementById('sectionInput').value;
    var examTypeInput = document.getElementById('examTypeInput').value;
    var englishMarks = document.getElementById('englishInput').value;
    var kannadaMarks = document.getElementById('kannadaInput').value;
    var mathsMarks = document.getElementById('mathsInput').value;
    var sciencehMarks = document.getElementById('scienceInput').value;
    var socialMarks = document.getElementById('socialInput').value;

    //validate if uid exists;if yes ,check examtype and insert if it doesnot exists
    if (students.filter(stu=>stu.uid==uniqueID).length > 0) {
        if (students.filter(stu=>stu.uid==uniqueID)[0].examType[examTypeInput] != null) {
            alert('Student marks already Entered for '+examTypeInput+'exam');
            return false;
        } 
    }
    var marks = new Marks(englishMarks,kannadaMarks,mathsMarks,sciencehMarks,socialMarks);
    if (examTypeInput == 'halfYearly') {
        var examType = new ExamType(marks,null);
    } else if (examTypeInput == 'quaterly') {
        var examType = new ExamType(null,marks);
    }

    var studentRecord = new StudentRecord(uniqueID,nameInput,gradeInput,sectionInput,examType);
    students.push(studentRecord);
    display(students);
    // console.log(students);
}

var applyFilter = function(){
    display(students);
}

var StudentRecord = function(uid,name,grade,section,examType) {
    this.uid = uid;
    this.name = name;
    this.grade = grade;
    this.section = section;
    this.examType = examType;
}

var ExamType = function(halfYearly,quaterly) {
    this.halfYearly = halfYearly;
    this.quaterly = quaterly;
}

var Marks = function(english,kannada,maths,science,social){
    this.english = Number(english);
    this.kannada = Number(kannada);
    this.maths = Number(maths);
    this.science = Number(science);
    this.social = Number(social);
}


var display = function(arr){
    var gradeFilter = document.getElementById('gradeFilter').value;
    var sectionFilter = document.getElementById('sectionFilter').value;
    var examTypeFilter = document.getElementById('examTypeFilter').value;
    var subjectFilter = document.getElementById('subjectFilter').value;
    var filteredSubjects = [];
    subjectFilter == 'all' ? (filteredSubjects = subjects) : (filteredSubjects = subjects.filter(sub=>sub==subjectFilter) );
    
    var marksTable = document.getElementById('marksTable');
    marksTable.innerHTML = '';
    var trh = document.createElement('tr');
    for(var i=0; i<record.length;i++){
        var th = document.createElement('th');
        th.innerHTML = record[i];
        trh.appendChild(th);
    }
    for(var i=0;i<filteredSubjects.length;i++){
        var th = document.createElement('th');
        th.innerHTML = filteredSubjects[i];
        trh.appendChild(th);
    }
    marksTable.appendChild(trh);
    // console.log(examTypeFilter,'extyfil');
    arr = arr.filter(stu=>stu.grade == gradeFilter);
    arr = arr.filter(stu=>stu.section==sectionFilter);
    
    for(var i=0; i<arr.length;i++){
        if (arr[i].examType[examTypeFilter]==null) {
            continue;
        }
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.innerHTML = arr[i].uid;
        tr.appendChild(td1);
        var td2 = document.createElement('td');
        td2.innerHTML = arr[i].name;
        tr.appendChild(td2);
        var td3 = document.createElement('td');
        td3.innerHTML = arr[i].grade;
        tr.appendChild(td3);
        var td4 = document.createElement('td');
        td4.innerHTML = arr[i].section;
        tr.appendChild(td4);
        var td5 = document.createElement('td');
        td5.innerHTML = examTypeFilter.toUpperCase();
        tr.appendChild(td5);
        for(var j=0;j<filteredSubjects.length;j++){            
            td = document.createElement('td');
            td.innerHTML = arr[i].examType[examTypeFilter][filteredSubjects[j].toLowerCase()];
            tr.appendChild(td);
        }
        marksTable.appendChild(tr);
    }
    //Average Calculation
    var avgRow = document.createElement('tr');
    for(var i=0; i<4;i++) {
        var etd = document.createElement('td');
        etd.style.background = 'green'
        etd.innerHTML = '  ';
        avgRow.appendChild(etd);
    }
    var avgCol = document.createElement('td');
    avgCol.innerHTML = 'AVERAGE';    
    avgRow.appendChild(avgCol);    
    for(var i=0;i<filteredSubjects.length;i++){
        var tda = document.createElement('td');
        tda.innerHTML = averageCalculator(arr,examTypeFilter,filteredSubjects[i].toLowerCase());
        avgRow.appendChild(tda);
    }
    marksTable.appendChild(avgRow);

    
    // Min 
    var minRow = document.createElement('tr');
    for(var i=0; i<4;i++) {
        var etd1 = document.createElement('td');
        etd1.style.background = 'green'
        etd1.innerHTML = '  ';
        minRow.appendChild(etd1);
    }
    var minCol = document.createElement('td');
    minCol.innerHTML = 'Minimum';    
    minRow.appendChild(minCol);
    for(var i=0;i<filteredSubjects.length;i++){
        var tdb = document.createElement('td');
        tdb.innerHTML = minMax(arr,examTypeFilter,filteredSubjects[i].toLowerCase())[0];
        minRow.appendChild(tdb);
    }
    marksTable.appendChild(minRow);    

    //Max
    var maxRow = document.createElement('tr');
    for(var i=0; i<4;i++) {
        var etd2 = document.createElement('td');
        etd2.style.background = 'green'
        etd2.innerHTML = '  ';
        maxRow.appendChild(etd2);
    }
    var maxCol = document.createElement('td');
    maxCol.innerHTML = 'Maximum';    
    maxRow.appendChild(maxCol);
    for(var i=0;i<filteredSubjects.length;i++){
        var tdm = document.createElement('td');
        tdm.innerHTML = minMax(arr,examTypeFilter,filteredSubjects[i].toLowerCase())[1];
        maxRow.appendChild(tdm);
    }
    marksTable.appendChild(maxRow);
}


var averageCalculator = function(arr,examTypeFilter,subj) {
    var newarr = arr.filter(stu => stu.examType[examTypeFilter] != null)
    var avg = newarr.reduce((acc,stu)=>{
        return acc+stu.examType[examTypeFilter][subj];
    },0)

    avg = avg/newarr.length;
    return avg.toFixed(2);
}

var minMax = function(arr,examTypeFilter,subj) {
    var newarr = arr.filter(stu => stu.examType[examTypeFilter] != null)
    var minMaxArray = newarr.map(stu=> {        
        return stu.examType[examTypeFilter][subj]
    })
    minMaxArray = minMaxArray.sort(function(a,b){
        return a - b;
    });    
    return [minMaxArray[0],minMaxArray[minMaxArray.length-1]];
}