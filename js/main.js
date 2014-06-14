/*
 App constains stimulation Android Pattern Unlock.
Author : Sanyam Agrawal
Date : 14th June 2014
*/

/*Following Reveling Modular Pattern(IIFE) in this code base so that the global namespace is not populated
 * app contains 3 methods which are exposed to the public , rest all the functions and variables are private
 */


var app = function() {

	/* Local Variables needed for the app to run . Making sure they are in the app scope and not in window scope*/
	var password = "",
		isSettingPattern,
		setPattern,
		start,
		end;

	/* Functionality to hide a Particualar Node
     * @private
	*/
	function hide(node) {
		node.classList.remove("show");
		node.classList.add("hide");
	}

	/* Functionality to show a Particualar Node
     * @private
	*/
	function show(node) {
		node.classList.remove("hide");
		node.classList.add("show");
	}

	/*
	Public method to kick of the cycle for this app. Creates the UI. THis is exposed as an external API
	@ Public
	*/
	function init() {
		var node = document.getElementById("showPattern"),
			container = document.createElement("div"),
			buttonContainer = document.createElement("div"),
			linesContainer,
			buttonNode,
			lineNode,
			containerCount = 0,
			count = 1,
			lines = {
				"straightLines": ["12", "23", "45", "56", "78", "89"],
				"verticleLines": ["14", "25", "36", "47", "58", "69"],
				"backLines": ["24", "35", "57", "68"],
				"frontLines": ["15", "26", "48", "59"]
			},
			keys,
			keyArray;

		node.innerHTML = "";
		password = "";
		container.classList.add("unlockContainer");
		node.appendChild(container);

		/*Adding All the possible Combinations of lines in the UI.
		  We need to do this before creating the buttons as these div are absolute postion,
		  on top of one another and the button should be on the top always, Otherwise the app will not work.
		*/
		for (keys in lines) {
			keyArray = lines[keys];
			linesContainer = document.createElement("div"),
			linesContainer.classList.add("linesContainer" + containerCount++);
			linesContainer.classList.add("clearfix");

			container.appendChild(linesContainer);

			for (count = 0; count < keyArray.length; count++) {
				lineNode = document.createElement("div");
				lineNode.classList.add(keys);
				lineNode.classList.add("floatLeft");

				lineNode.setAttribute("id", keyArray[count]);
				linesContainer.appendChild(lineNode);
			}
		}

		//Adding Buttons to the UI
		buttonContainer.className = "buttonContainer clearfix";
		container.appendChild(buttonContainer);

		for (count = 1; count < 10; count++) {
			buttonNode = document.createElement("div");
			buttonNode.className = "lbbutton lockButton floatLeft";
			buttonNode.setAttribute("id", count);

			//Attaching Mouse Events
			buttonNode.onmouseover = mouseOver.bind(this);
			buttonNode.onmousedown = mouseDown.bind(this);
			buttonNode.onmouseup = mouseUp.bind(this);

			//Attaching Touch Events
			buttonNode.ontouchstart = mouseOver.bind(this);
			buttonNode.ontouchend = mouseUp.bind(this);

			buttonContainer.appendChild(buttonNode);
		}

	}

	/* ON mouse over on element. WE need to show the line between the previous and current button
		@private
	*/
	function mouseOver(event) {
		var node,
			lineId,
			lineNode;
		if (!!this.isSettingPattern) {
			node = event.target;
			if (!node.classList.contains("lockButtonClicked")) {
				mouseDown(event);
				lineId = end > start ? start + end : end + start;

				lineNode = document.getElementById(lineId);
				lineNode.style.visibility = "visible";
			}
		}

		return false;
	}

	/* Stopping the creating of the Pattern once the mouse has been released
		@private
	*/
	function mouseUp(event) {
		if(this.isSettingPattern) {
			this.isSettingPattern = false;
		}
		return false;
	}
	/* kick of the creation of the pattern by seeting to true
		@private
	*/
	function mouseDown(event) {
		var node = event.target,
			id = node.getAttribute("id");

		this.isSettingPattern = true;
		node.classList.remove("lockButton");
		node.classList.add("lockButtonClicked");
		end = start;
		start = id;
		password += id;
		console.log(password);
		return false;
	}

	/* Public method to save a pattern and toggle and check button
		@public
	*/
	function saveLockPattern() {
		var node = document.getElementById("errorMessage"),
			saveButton = document.getElementById("setPattern"),
			checkButton = document.getElementById("checkPattern"),
			length = password.length,
			message;

		if (password === "") {
			message = "No Pattern Set. Please Set A Pattern and try again";

		} else if (length < 4) {
			message = "Unlock Pattern Cannot Be less then 4 . Please Set And Try Again";
		} else {
			message = "Pattern Successfully Saved!. Now Try Unlocking App With this Pattern";
			hide(saveButton);
			show(checkButton);
			setPattern = password;

		}
		node.innerHTML = message;
		node.classList.remove("hide");
		node.classList.add("show");
		init();
	}
	/*
		publci api to check if the pattern is correct or not.
	*/
	function checkPattern() {
		var node = document.getElementById("errorMessage"),
			patternNode = document.getElementById("showPattern"),
			checkButton = document.getElementById("checkPattern");

		if (password === setPattern) {
			node.innerHTML = "UnLock Successful";
			hide(patternNode);
			hide(checkButton);
		} else {
			node.innerHTML = "Wrong Pattern! Try Again";
			init();

		}

	}

	 /* Reveling Modular Pattern. Only Expose a certain set of API to the user*/
	return {
		init: init,
		saveLockPattern: saveLockPattern,
		checkPattern: checkPattern
	};

}();

window.addEventListener("DOMContentLoaded", app.init, false);