// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBx2BpUtr3RqMX_0sESQdVAm1TgEo9Rgn8",
    authDomain: "train-schedule-22099.firebaseapp.com",
    databaseURL: "https://train-schedule-22099.firebaseio.com",
    projectId: "train-schedule-22099",
    storageBucket: "",
    messagingSenderId: "117425454248",
    appId: "1:117425454248:web:ca320639aa4575e3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var nameTrain = "";
var destinationTrai = "";
var firstTrain = "";
var trainFrequency = "";



var correntTime = moment().format('MMMM Do YYYY, h:mm a');

console.log(correntTime);

$('#btn').on("click", function() {
    event.preventDefault();

    nameTrain = $("#traintName").val().trim();
    destinationTrain = $("#trainDestination").val().trim();
    firstTrain = $("#trainFirst").val().trim();
    trainFrequency = $("#trainFrequency").val().trim();

    database.ref().push({
        nameTrain: nameTrain,
        destinationTrain: destinationTrain,
        firstTrain: firstTrain,
        trainFrequency: trainFrequency
    });

    console.log(nameTrain);
    console.log(destinationTrain);
    console.log(firstTrain);
    console.log(trainFrequency);

    $("#traintName").val("");
    $("#trainDestination").val("");
    $("#trainFirst").val("");
    $("#trainFrequency").val("");

});

database.ref().on("child_added", function(childSnapshot) {

    console.log(childSnapshot.val());

    var tFrequency = parseInt(childSnapshot.val().trainFrequency);



    console.log(tFrequency);


    var firstTime = childSnapshot.val().firstTrain;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var tRemainder = diffTime % tFrequency;

    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format('LT'));

    var newTable = $('<tr>');
    newTable.append($("<td>" + childSnapshot.val().nameTrain + "</td>"));
    newTable.append($("<td>" + childSnapshot.val().destinationTrain + "</td>"));
    newTable.append($('<td class="align-items-center">' + tFrequency + "</td>"));
    newTable.append($("<td>" + moment(nextTrain).format('LT') + "</td>"));
    newTable.append($("<td>" + tMinutesTillTrain + "</td>"));

    $('#newTrain').append(newTable);


});