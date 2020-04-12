# Introduction

Welcome to [project-anything](https://project-anything.herokuapp.com/). This is a web-based application to be able to create audio projects.
Any user may create an account or log in through google. Afterwards, you are allowed to create a project.
Inside each project, you may add as many audio files as you like. You can then edit the tracks using our user interface.
Every edit you make is automatically saved. Futhermore, you can publish your edited project to the public. At any time, you
can change your project back to private.

## <span id="api-creating-user">Creating a user</span>

Easily create a new account by clicking on register at the homepage and enter the required fields. Please note that password must be at least 8 characters, contains 1 capital letter, 1 lower case letter and 1 number.
![Photo](https://project-anything.herokuapp.com/media/doc/Signup.JPG "API Image")

## <span id="api-logging-in">Logging in a user</span>

You can log in by clicking on login at homepage and entering the correct credentials. Additionally, you can login through google as the button is clearly visible.
![Photo](https://project-anything.herokuapp.com/media/doc/Signin.JPG "API Image")

## <span id="api-creating-deleteing-projects">Creating/Deleting Projects</span>

At the homepage, you can create any number of projects by simply entering a name into the box and clicking create. Your projects will show below and you can delete them by clicking the trash icon to the right of it. There's no need to worry about
accidentily deleting a photo because it asks for confirmation before actually deleting a project.
![Photo](https://project-anything.herokuapp.com/media/doc/Project.JPG "API Image")

## <span id="api-renaming-project">Renaming Projects</span>

To rename a project, simply go into the project and located at the header will be the title. To the right of the title, will be an edit icon. Click on the edit icon and you can change the name of the project. Make sure to click the check mark so that your new title is actually saved.
![Photo](https://project-anything.herokuapp.com/media/doc/Title_Rename.JPG "API Image")

## <span id="api-publishing-and-privating-project">Publishing and Privating Projects</span>

You can make your project public and private anytime. Only the current state of your project at publishing will be public. Any changes after are not public. Therefor if you want any new changes to be public, you must click publish again. Additionally, there will only be one version of your project public, so don't worry about spamming the public! You can view other people's public track at the homepage.
![Photo](https://project-anything.herokuapp.com/media/doc/Private_Project.JPG "API Image")
![Photo](https://project-anything.herokuapp.com/media/doc/Public_Project.JPG "API Image")

## <span id="api-upload-track">Uploading a Track</span>

To upload a track simply drag a file and drop it into the box indicated to the left of the private/public status box.
![Photo](https://project-anything.herokuapp.com/media/doc/Upload_Track.JPG "API Image")

## <span id="api-time-display">Project Time Display</span>

The marker's time can easily be viewed at the bottom of your track visuals. The start time and end time show the span when using the "select audio region" cursor.
![Photo](https://project-anything.herokuapp.com/media/doc/Time.JPG "API Image")

## <span id="api-time-display">Project Time Display</span>

The marker's time can easily be viewed at the bottom of your track visuals. The start time and end time show the span when using the "select audio region" cursor.
![Photo](https://project-anything.herokuapp.com/media/doc/Time.JPG "API Image")

## <span id="api-button-functions">Button Action</span>

Play the track from marker.
<img src="https://project-anything.herokuapp.com/media/play-button.png" alt="drawing" width="60"/> <br>
Pause the track at the marker.
<img src="https://project-anything.herokuapp.com/media/pause.png" alt="drawing" width="60"/><br>
Stop the track and cursor will automatically jump to start
<img src="https://project-anything.herokuapp.com/media/stop-button.png" alt="drawing" width="60"/><br>
Jump to start of track.
<img src="https://project-anything.herokuapp.com/media/start.png" alt="drawing" width="60"/><br>
Jump to end of track.
<img src="https://project-anything.herokuapp.com/media/end.png" alt="drawing" width="60"/><br>
Record audio input and upload the recorded audio track to the project.
<img src="https://project-anything.herokuapp.com/media/microphone.png" alt="drawing" width="60"/><br>
Change cursor state to select.
<img src="https://project-anything.herokuapp.com/media/cursor.png" alt="drawing" width="60"/><br>
Change cursor state to select region.
<img src="https://project-anything.herokuapp.com/media/select-button.png" alt="drawing" width="60"/><br>
Shift an audio track. Click this button and then move the track left and right to set the start time.
<img src="https://project-anything.herokuapp.com/media/shift.png" alt="drawing" width="60"/><br>
Change cursor state to fade in state and then click the point in the track to apply the fade in time.
<img src="https://project-anything.herokuapp.com/media/fadein.png" alt="drawing" width="60"/><br>
Change cursor state to fade out state and then click the point in the track to apply the fade in time.
<img src="https://project-anything.herokuapp.com/media/fadeout.png" alt="drawing" width="60"/><br>
Change play state to loop. This makes the current selected region play continously. If the marker reaches the end, it will go back to the start of the region and play back.
<img src="https://project-anything.herokuapp.com/media/loop.png" alt="drawing" width="60"/><br>
Click this button to trim a selected region. This means that when you select a region and click trim, the audio affect the selected region and before the selected region will be cut out.
<img src="https://project-anything.herokuapp.com/media/trim.png" alt="drawing" width="60"/><br>
Click this button to start rendering the project as a single audio file to download.
<img src="https://project-anything.herokuapp.com/media/rendering.png" alt="drawing" width="60"/><br>
After rendering, click this button to download the audio file.
<img src="https://project-anything.herokuapp.com/media/download.png" alt="drawing" width="60"/><br>
Click this button for the project to zoom in.
<img src="https://project-anything.herokuapp.com/media/zoom-in.png" alt="drawing" width="60"/><br>
Click this button for the project to zoom out.
<img src="https://project-anything.herokuapp.com/media/zoom-out.png" alt="drawing" width="60"/><br>
Click this button to undo the most recent change. Becareful considerate when making changes because only the most recent action can be undone.
<img src="https://project-anything.herokuapp.com/media/undo.png" alt="drawing" width="60"/><br>
The following buttons are found to the left of the track which clearly indicate what they do. Mute, solo or delete the track.
<img src="https://project-anything.herokuapp.com/media/doc/Track_Buttons.JPG" alt="drawing" width="100"/><br>

There are several options that can also be found below the buttons. These are pretty self explanitory as it indicates what can be changed, the new change value if there is one and the execute button which execute the changes you want.

## <span id="api-Conclusion">Developing Application</span>

Please bear in mind that there is always room for improvement and we do strive to make this application better. Please leave feedback to us via github or you could always attempt to contact us as we are always accepting opinions. Lastly, before the API documentation, we hope you enjoy using our web application.