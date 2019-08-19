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

var nameTrain = ""; // new train name
var destinationTrai = ""; // new train destination
var firstTrain = ""; // first train
var trainHour = ""; // train hour
var trainMinute = ""; // train minute
var trainFrequency = ""; // train frequency

$('.attention').hide(); // hide attention div if user unputs all details of the train

var correntTime = moment().format('MMMM Do YYYY, h:mm a'); // corrent time

// console.log(correntTime);

$('#btn').on("click", function() {
    event.preventDefault();

    trainHour = $('#trainHour').val().trim();
    trainMinute = $('#trainMinute').val().trim();

    nameTrain = $("#traintName").val().trim();
    destinationTrain = $("#trainDestination").val().trim();
    firstTrain = trainHour + ":" + trainMinute;
    trainFrequency = $("#trainFrequency").val().trim();

    if (nameTrain === "" ||
        destinationTrain === "" ||
        firstTrain === "" ||
        trainFrequency === "") {
        $('.attention').show();
        $('.attention').html("<p>Please input all details to add a new train and press submit</p>");

    } else {
        $('.attention').hide();
        $('.attention').html("");

        database.ref().push({
            nameTrain: nameTrain,
            destinationTrain: destinationTrain,
            firstTrain: firstTrain,
            trainFrequency: trainFrequency
        });

        // console.log(nameTrain);
        // console.log(destinationTrain);
        // console.log(firstTrain);
        // console.log(trainFrequency);

        $("#traintName").val("");
        $("#trainDestination").val("");
        $("#trainHour").val("");
        $("#trainMinute").val("");
        $("#trainFrequency").val("");
    }
});

database.ref().on("child_added", function(childSnapshot) {

    // console.log(childSnapshot.val());

    var tFrequency = parseInt(childSnapshot.val().trainFrequency);

    // console.log(tFrequency);


    var firstTime = childSnapshot.val().firstTrain;

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var tRemainder = diffTime % tFrequency;

    var tMinutesTillTrain = tFrequency - tRemainder;

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    var key = childSnapshot.key;

    // console.log(key);

    var newTable = $('<tr>');
    newTable.append($("<td>" + childSnapshot.val().nameTrain + "</td>"));
    newTable.append($("<td>" + childSnapshot.val().destinationTrain + "</td>"));
    newTable.append($('<td class="text-center">' + tFrequency + "</td>"));
    newTable.append($('<td class="text-center">' + moment(nextTrain).format('LT') + "</td>"));
    newTable.append($('<td class="text-center">' + tMinutesTillTrain + "</td>"));
    newTable.append($("<td class='text-center hover' data-name ='" + key + "' >" + '<i class="fa fa-trash"></i>' + "</td>"));
    console.log();



    $('#newTrain').append(newTable);

    $(document).on("click", ".hover", function() {
        keyremove = $(this).attr("data-name");
        database.ref().child(keyremove).remove();
        window.location = 'index.html';

    });

    setInterval(function() {
        window.location = 'index.html';
    }, 60000);


});