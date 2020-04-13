# Online Music Creator Studio
## Links
**App Url:** https://project-anything.herokuapp.com/

**Video Url:** https://youtu.be/dskWQh1FS78

**Docs Url:** https://project-anything.herokuapp.com/doc/index.html

## Team Members
Tabeeb Yeamin, Sanjam Sigdel, Gabrian Mak

## Description

Anything is a web based Digital Audio Workstation (DAW) and music sharing platform. Authenticated users can upload, record and edit audio clips using the web based graphical user interface. They can export their music and share it to their music gallery for other authenticated users to view. (Time permitting) users can send invites to other users to their project files and they can edit them together in real time, kind of like Google Docs but for music editing.

## Features

#### By Beta:
Crossed out features are features that we could not fulfill.
- Real time audio recording, visualization
- Ability to make multiple tracks
- Audio editing features:
    - splitting
    - moving
    - fadein
    - fadeout
    - mute
    - volume
    - delete tracks
    -~~Advanced FX: Reverb, Delay, Equalization, Compression~~
- Saving and sharing files with authenticated users
- Allow users to authenticate using Google ~~and upload tracks directly to YouTube, soundcloud etc.~~

#### By Final:
- User Galleries: Authenticated users can view other users publicly shared music
- Project: Recording feature, undo feature
- ~~Advanced: Google docs like real time multi user editing~~

## Technology:
1. Nodejs

   We will use Nodejs for backend purposes.

2. ~~React~~

   ~~React for frontend purposes.~~

3. jQuery

   jQuery for frontend purposes. Only within the project event emitter and the waveform playlist api itself. No other significant use

4. [Wavesurfer](https://github.com/katspaugh/wavesurfer.js)

   Audio visualization API  for generating waveform graphs.

5. [Web Audio API](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html)

   Web Audio API to cut, trim, adjust volume and pitch, equalize, and perform many other changes to out audio.

6. Google Authentication

   Authentication for the web application, also allows for sharing to Youtube.

## Challenges
1. ~~Learning React to use for frontend~~

   ~~No team member has previous experience using React, everyone has to learn it for the purpose of this application.~~

2. Planning for scalability

   When users upload tracks to their gallery, we should account for having a large database in the future, or more efficent methods of storing data.
   
3. Getting used to new APIs

   Reading through the documentation and understanding the methods provided by the API to decide the best course of action for the web application
   
4. Maximizing Performance

    As we utilize a new API, we are unsure of how the performance may be affected as more and more tracks of audio are being added to the current workstation. However, we will observe different factors that may affect the speed of the performance and ensure that no unnecessary work is being done.

5. Mid-Project Adjustments

   Hosting a gallery for each user may seem to take too long, or some previous features may take some time, so we need to be able to change our application and come up with contingency plans if certain features don't work out.
   


