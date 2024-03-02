const semesterTableBody = document.getElementById("semesterTableBody");
const semesterTableHead = document.getElementById("semesterTableHead");
const yearSelect = document.getElementById("yearSelect");
const semSelect = document.getElementById("semSelect");
const departmentSelect = document.getElementById("deptValue");
var departmentData; // Declare departmentData globally
function checkGrades(marksArray, placesArray) {
  var semValue = document.getElementById("semValue").value;
  document.querySelectorAll("table th")[2].classList.remove("hideIt");

  // Array to store calculated points
  let pointsArray = [];

  document.querySelectorAll(`#SGPAGrade`).forEach(function (element) {
    element.classList.remove("hideIt");
  });

  for (let i = 0; i < marksArray.length; i++) {
    const inputValue = marksArray[i];
    const index = placesArray[i];
    let calculatedValue;

    if (!isNaN(inputValue)) {
      switch (true) {
        case inputValue >= 90:
          calculatedValue = 10;
          break;
        case inputValue >= 80:
          calculatedValue = 9;
          break;
        case inputValue >= 70:
          calculatedValue = 8;
          break;
        case inputValue >= 60:
          calculatedValue = 7;
          break;
        case inputValue >= 50:
          calculatedValue = 6;
          break;
        case inputValue >= 40:
          calculatedValue = 5;
          break;
        default:
          calculatedValue = 2;
      }
    } else {
      calculatedValue = 0;
    }
    index.innerHTML = calculatedValue;

    // Push the calculated point to the array
    pointsArray.push(calculatedValue);
  }

  // Return the array of calculated points
  return pointsArray;
}

function loadNames() {
  return fetch("/json/depDetails.json")
    .then((response) => response.json())
    .then((data) => {
      departmentData = data;
      updateDropDown_Table();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Call the function to load names
loadNames();

function updateDropDown_Table() {
  document.getElementById("result1").innerHTML = "";
  var pattern = document.querySelector(
    'input[name="calculationType"]:checked'
  ).value;
  let deptValue = document.getElementById("deptValue").value;

  switch (pattern) {
    case "cgpa":
      yearSelect.classList.add("hideIt");
      semSelect.classList.add("hideIt");
      semSelect.innerHTML = "";
      yearSelect.innerHTML = "";
      semesterTableHead.innerHTML = `
  <tr>
    <th>Semester</th>
    <th>Credits</th>
    <th>Total Points</th>
  </tr>
`;
      semesterTableBody.innerHTML = "";
      // Loop through semesters 1 to 8
      for (var i = 1; i <= 8; i++) {
        var row = `<tr>
    <td>Semester ${i}</td>
    <td>${calculateTotalCredits(departmentData[deptValue]["sem" + i])}</td>
    <td><input type="number" class="form-control" id="sem${i}" size="10" required /></td>
  </tr>`;

        semesterTableBody.innerHTML += row;
      }
      break;

    case "ygpa":
      yearSelect.classList.remove("hideIt");
      semSelect.classList.add("hideIt");
      semSelect.innerHTML = "";
      semesterTableHead.innerHTML = `
  <tr>
    <th>Semester</th>
    <th>Credits</th>
    <th>Marks/Points</th>
  </tr>
`;
      semesterTableBody.innerHTML = "";
      yearSelect.innerHTML = `
  <select id="yearValue" onchange="updateYearDD()">
    <option value="1">1<sup>st</sup> Year</option>
    <option value="2">2<sup>nd</sup> Year</option>
    <option value="3">3<sup>rd</sup> Year</option>
    <option value="4">4<sup>th</sup> Year</option>
  </select>
`;
      updateYearDD();
      break;

    case "sgpa":
      yearSelect.classList.add("hideIt");
      semSelect.classList.remove("hideIt");
      yearSelect.innerHTML = "";
      semesterTableBody.innerHTML = "";
      semSelect.innerHTML = `
  <select id="semValue" onchange="updateSemDD()">
    <option value="sem1" selected>1st Semester</option>
    <option value="sem2">2nd Semester</option>
    <option value="sem3" >3rd Semester</option>
    <option value="sem4">4th Semester</option>
    <option value="sem5">5th Semester</option>
    <option value="sem6">6th Semester</option>
    <option value="sem7">7th Semester</option>
    <option value="sem8">8th Semester</option>
  </select>
`;
      semesterTableHead.innerHTML = `
  <tr>
    <th>Subject</th>
    <th>Credit</th>
    <th>Credit Earned !</th>
    <th>Marks Obtained</th>
  </tr>
`;
      updateSemDD();
      break;

    default:
      break;
  }
}

function updateSemDD() {
  document.querySelectorAll("table th")[2].classList.add("hideIt");
  document.getElementById("result1").innerHTML = "";
  let deptValue = document.getElementById("deptValue").value;
  let semValue = document.getElementById("semValue").value;
  semesterTableBody.innerHTML = "";

  let row = "";
  let electiveOptions = {}; // Initialize electiveOptions

  for (let i = 0; i < departmentData[deptValue][semValue].length; i++) {
    const subject = departmentData[deptValue][semValue][i];

    if (!subject.set) {
      // Non-elective subject
      row += `
  <tr>
    <td>${subject.subName}</td>
    <td id ="creditSGPA">${subject.subCredits}</td>
    <td id="SGPAGrade" class ="hideIt"></td>
    <td>
      <input
        type="number"
        class="form-control"
        id="subMarks${semValue}"
        size="10"
        ${!/[a-zA-Z]$/.test(subject.subCode.slice(-1)) ? "required" : ""}
      />
    </td>
  </tr>`;
    } else {
      // Elective subject with dropdown for sets
      if (!electiveOptions[subject.set]) {
        electiveOptions[subject.set] = [];
      }

      // Increment index for each set

      electiveOptions[subject.set].push({ ...subject });
    }
  }

  // Add options to a select element for each elective set
  for (const set in electiveOptions) {
    if (electiveOptions.hasOwnProperty(set)) {
      const options = electiveOptions[set]
        .map(
          (subject) =>
            `<option value="${subject.subCode}">${
              window.matchMedia("(max-width: 767px)").matches
                ? subject.subCode
                : subject.subName
            }</option>`
        )
        .join("");

      row += `
  <tr>
    <td>
      <select
        class="drop4"
        id="${semValue}electiveSubjectSet${set}"
      >
      ${
        window.matchMedia("(max-width: 767px)").matches
          ? set
          : `Select Elective for Set ${set}`
      }</option>
        ${options}
      </select>
    </td>
    <td id="creditSGPA">${electiveOptions[set][0].subCredits}</td>
    <td id="SGPAGrade" class ="hideIt"></td>
    <td>
      <input
        type="number"
        class="form-control"
        id="subMarks${semValue}"
        size="10"
        ${!/[a-zA-Z]$/.test(options[0]?.subCode?.slice?.(-1)) ? "required" : ""}
      />
    </td>
  </tr>`;
    }
  }

  semesterTableBody.innerHTML += row;
}

function updateYearDD() {
  document.getElementById("result1").innerHTML = "";
  let deptValue = document.getElementById("deptValue").value;
  let yearValue = document.getElementById("yearValue").value;
  semesterTableBody.innerHTML = "";
  var row = `<tr>
  <td>Semester ${(yearValue - 1) * 2 + 1}</td>
  <td id ="creditYGPA">${calculateTotalCreditsForSemester(
    departmentData[deptValue]["sem" + ((yearValue - 1) * 2 + 1)]
  )}</td>
  <td><input type="number" class="form-control" id="semester${
    (yearValue - 1) * 2 + 1
  }" size="10" required /></td>
</tr>
<tr>
  <td>Semester ${(yearValue - 1) * 2 + 2}</td>
    <td id ="creditYGPA">${calculateTotalCreditsForSemester(
      departmentData[deptValue]["sem" + ((yearValue - 1) * 2 + 2)]
    )}</td>

  <td><input type="number" class="form-control" id="semester${
    (yearValue - 1) * 2 + 2
  }" size="10" required /></td>
</tr>`;
  semesterTableBody.innerHTML += row;
}
function calculate() {
  let result1 = document.getElementById("result1");
  var pattern = document.querySelector(
    'input[name="calculationType"]:checked'
  ).value;
  switch (pattern) {
    case "cgpa":
      result1.innerHTML = "";
      dataArray = [];
      for (let i = 1; i <= 8; i++) {
        var inputId = `sem${i}`;
        var inputValue = document.getElementById(inputId).value;

        dataArray.push(parseFloat(inputValue) || 0);
      }

      var result =
        ((dataArray[0] + dataArray[1]) / 2 +
          (dataArray[2] + dataArray[3]) / 2 +
          (1.5 * (dataArray[4] + dataArray[5])) / 2 +
          (1.5 * (dataArray[6] + dataArray[7])) / 2) /
        5;
      result1.innerHTML = "Your CGPA is " + result.toFixed(2);
      break;

    case "sgpa":
      result1.innerHTML = "";
      var sem = document.getElementById("semValue").value;
      const elements = document.querySelectorAll(`[id^="subMarks${sem}"]`);
      const gradesElements = document.querySelectorAll(`[id^="SGPAGrade"]`);
      var creditElements = document.querySelectorAll("#creditSGPA");
      var textContentArray = [];

      creditElements.forEach(function (element) {
        textContentArray.push(parseFloat(element.textContent));
        console.log(textContentArray);
      });

      // Extract values from elements and gradesElements
      const marksArray = Array.from(elements).map((element) => element.value);
      const gradesArray = Array.from(gradesElements).map((element) => element);

      // Pass both arrays to the checkGrades function
      pointsArray = checkGrades(marksArray, gradesArray);
      console.log(pointsArray);
      var total = 0;

      for (let i = 0; i < pointsArray.length; i++) {
        total += textContentArray[i] * pointsArray[i];
      }

      console.log(total);

      var result =
        total / textContentArray.reduce((sum, credit) => sum + credit, 0);

      result1.innerHTML = "Your SGPA is " + result.toFixed(2);
      break;

    case "ygpa":
      var year = document.getElementById("yearValue").value;
      var creditElements = document.querySelectorAll("#creditYGPA");
      var credits = Array.from(creditElements).map(
        (creditElement) => parseFloat(creditElement.innerText) || 0
      );
      var semI = Number(
        document.getElementById(`semester${(year - 1) * 2 + 1}`).value
      );
      var semII = Number(
        document.getElementById(`semester${(year - 1) * 2 + 2}`).value
      );

      // Ensure the necessary elements are present
      if (!result1 || !year || credits.length !== 2 || !semI || !semII) {
        console.log(result1, year, credits, semI, semII);
      }

      // Perform the YGPA calculation
      var result = (semI + semII) / (credits[0] + credits[1]);
      result1.innerHTML = "Your YGPA is " + result.toFixed(2);

      break;

    default:
      break;
  }
}

function clearInputs() {
  var inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(function (input) {
    input.value = "";
  });
  var Value;
  console.log(Value);
  if (
    document.querySelectorAll("table th")[2].innerHTML !== "Marks/Points" &&
    document.querySelectorAll("table th")[2].innerHTML !== "Total Points"
  ) {
    document.querySelectorAll("table th")[2].classList.add("hideIt");
  }
  document.querySelectorAll(`#SGPAGrade`).forEach(function (element) {
    element.classList.add("hideIt");
  });

  document.getElementById("result1").innerHTML = "";
}

function calculateTotalCredits(semesterSubjects) {
  const encounteredSets = new Set();
  return semesterSubjects.reduce((total, subject) => {
    if (
      subject["isElective"] === "true" &&
      !encounteredSets.has(subject["set"])
    ) {
      total += subject["subCredits"];
      encounteredSets.add(subject["set"]);
    } else if (subject["isElective"] !== "true") {
      total += subject["subCredits"];
    }
    return total;
  }, 0);
}
function calculateTotalCreditsForSemester(semester) {
  const encounteredSets = new Set();
  return semester.reduce((total, subject) => {
    if (
      subject["isElective"] === "true" &&
      !encounteredSets.has(subject["set"])
    ) {
      total += subject["subCredits"];
      encounteredSets.add(subject["set"]);
    } else if (subject["isElective"] !== "true") {
      total += subject["subCredits"];
    }
    return total;
  }, 0);
}
