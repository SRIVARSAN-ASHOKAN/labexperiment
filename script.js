function calculateAge() {
    const dob = document.getElementById("dob").value;
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    document.getElementById("age").value = age;
}

function submitForm() {
    const age = parseInt(document.getElementById("age").value);

    if (age < 18 || age > 100) {
        alert("Age must be between 18 and 100");
        return false;
    }
    let n = document.getElementById("name").value;
    const data = {
        Name: n,
        Aadhaar: aadhaar.value,
        Age: age,
        Mobile: mobile.value,
        Email: email.value,
        Pincode: pincode.value,
        State: state.value,
        District: district.value
    };

    let output = "<hr>";
    for (let key in data) {
        output += `<p><b>${key}:</b> ${data[key]}</p>`;
    }

    document.getElementById("details").innerHTML = output;
    document.getElementById("overlay").style.display = "block";

    return false;
}

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("voteForm").reset();
}
