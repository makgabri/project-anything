define({ "api": [
  {
    "type": "post",
    "url": "/add_project/",
    "title": "Create a project",
    "version": "1.0.0",
    "name": "add_project",
    "group": "Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Creates a project object given the title.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the project</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X POST -d '{\"title\":\"Happy Vibes\"}' -b cookie.txt https://https://project-anything.herokuapp.com/add_project/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Automatically generated id for project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the just created project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Username/googleId of current user</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Current date specifying the created time of project</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isPublic",
            "description": "<p>Indicates public/private status of project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "pubFile_id",
            "description": "<p>References public file id if public</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": true,
            "field": "publicDate",
            "description": "<p>References most recent date public</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"_id\": \"121321545123\",\n  \"title\": \"Happy Vibes\",\n  \"author\": \"Foobar\",\n  \"date\": \"2020-04-11T17:48:30.049+00:00\",\n  \"isPublic\": \"false\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TitleNotFound",
            "description": "<p>title must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "TitleInvalid",
            "description": "<p>title must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"title must be alphanumeric\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "delete",
    "url": "/project/:projectId/",
    "title": "Deletes a project",
    "version": "1.0.0",
    "name": "delete_project",
    "group": "Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Deletes the project. Removes all tracks corresponding to project. Also removes the public project if it was public.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>Id of project to delete</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X DELETE -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>ProjectId: xxxxxxxxxx has been deleted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"ProjectId: xxxxxxxxxx has been deleted\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>projectId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>projectId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>You are not the owner of this project</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>ProjectId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this project\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/project/:projectId/",
    "title": "Get the project object",
    "version": "1.0.0",
    "name": "get_project",
    "group": "Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets the project details of the projectId</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>Id of project</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Automatically generated id for project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the just created project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Username/googleId of current user</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Current date specifying the created time of project</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isPublic",
            "description": "<p>Indicates public/private status of project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "pubFile_id",
            "description": "<p>References public file id if public</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": true,
            "field": "publicDate",
            "description": "<p>References most recent date public</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"_id\": \"yyyyyyy\",\n     \"author\": \"Foobar\",\n     \"date\": \"2020-04-11T17:48:30.049+00:00\",\n     \"title\": \"Weird Vibes\",\n     \"isPublic\": \"true\",\n     \"pubFile_id\": \"abcabcabc\",\n     \"publicDate\": \"2020-04-11T17:48:30.049+00:00\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>projectId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>projectId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>You are not the owner of this project</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>ProjectId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this project\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "patch",
    "url": "/project/:projectId/title/",
    "title": "Update project name",
    "version": "1.0.0",
    "name": "new_project_title",
    "group": "Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Renames the title of a project</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>Id of project to be renamed</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newTitle",
            "description": "<p>New title of the project</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X PATCH -d '{\"newTitle\":\"Sad Vibes\"}' -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/title/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>successfully changed title</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"successfully changed title\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TitleNotFound",
            "description": "<p>title must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "TitleInvalid",
            "description": "<p>title must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>projectId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>projectId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>You are not the owner of this project</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>ProjectId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"title must be alphanumeric\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/project/:projectId/tracks/",
    "title": "Get list of tracks",
    "version": "1.0.0",
    "name": "project_track_list",
    "group": "Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Collects all the tracks corresponding to the project</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>Id of project</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/tracks/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "track_list",
            "description": "<p>list of tracks corresponding to project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"[\n {\n     \"_id\": \"yyyyyyyy\",\n     \"projectId\": \"xxxxxxx\",\n     \"author\": \"Foobar\",\n     \"name\": \"Track1\",\n     \"gain\": 1,\n     ...\n     \"stereoPan\": 0.5\n },\n {\n     \"_id\": \"zzzzzzz\",\n     \"projectId\": \"xxxxxxx\",\n     \"author\": \"Foobar\",\n     \"name\": \"Track2\",\n     \"gain\": 1,\n     ...\n     \"stereoPan\": 0.5\n }]\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>projectId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>projectId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>You are not the owner of this project</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>ProjectId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this project\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "get",
    "url": "/project/user/",
    "title": "Gets list of projects",
    "version": "1.0.0",
    "name": "user_project_list",
    "group": "Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets a list of projects that belongs to the user</p>",
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/project/user/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "proj_list",
            "description": "<p>List of projects containing their id's and titles</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"[\n {\n     \"_id\": \"xxxxxxx\",\n     \"title\": \"Funny Vibes\"\n },\n {\n     \"_id\": \"yyyyyyy\",\n     \"title\": \"Weird Vibes\"\n }]\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Bad Request\n\"You are not logged in\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/project.js",
    "groupTitle": "Project"
  },
  {
    "type": "delete",
    "url": "/project/:projectId/file/",
    "title": "Deletes a public project",
    "version": "1.0.0",
    "name": "delete_pubProj",
    "group": "Public_Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Deletes the public project. Removes public files from database.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>ID of public project to delete</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X DELETE -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/file/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Successfully removed pubProject File</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"Successfully removed pubProject File\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>projectId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>projectId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>ProjectId: xxxxxxxxx does not belong to you</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>ProjectId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this project\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/public_project.js",
    "groupTitle": "Public_Project"
  },
  {
    "type": "get",
    "url": "/project/:projectId/file/",
    "title": "Get the public project file",
    "version": "1.0.0",
    "name": "get_pubProj",
    "group": "Public_Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets the public project file and downloads it.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>ID of public project file to get</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/file/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "final_file",
            "description": "<p>The file of the track</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>trackId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotValid",
            "description": "<p>trackId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>ProjectId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not logged in\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/public_project.js",
    "groupTitle": "Public_Project"
  },
  {
    "type": "get",
    "url": "/project/user/",
    "title": "Gets list of public projects",
    "version": "1.0.0",
    "name": "get_pubProj_list",
    "group": "Public_Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets a list of public projects that can be viewed</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "page",
            "description": "<p>page to index public files</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/public_project/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "pubProjs",
            "description": "<p>List of public projects containing author, title, publicDate and pubFileId</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"[\n {\n     \"author\": \"Foobar\",\n     \"title\": \"Funny Vibes\",\n     \"publicDate\": \"2020-04-11T17:48:30.049+00:00\"\n     \"pubFile_id\": \"123xasd\"\n },\n {\n     \"author\": \"Thierry\",\n     \"title\": \"CSCC09 Lecture 999\",\n     \"publicDate\": \"2020-04-11T17:48:30.049+00:00\"\n     \"pubFile_id\": \"aaaaaaaaaa\"\n }]\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "PageIsNotInt",
            "description": "<p>Page must be integer</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Bad Request\n\"You are not logged in\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/public_project.js",
    "groupTitle": "Public_Project"
  },
  {
    "type": "get",
    "url": "/public_project/size/",
    "title": "Get Max Homepage size",
    "version": "1.0.0",
    "name": "get_pubProj_pageSize",
    "group": "Public_Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets the maximmum number of pages at homepage. Each page can display 3 audio files. So The number of pages is number of public projects divided by 3.</p>",
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/public_project/size/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "size",
            "description": "<p>Number of maximum homepages</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"3\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Bad Request\n\"You are not logged in\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/public_project.js",
    "groupTitle": "Public_Project"
  },
  {
    "type": "post",
    "url": "/project/:projectId/file/",
    "title": "Create a public project",
    "version": "1.0.0",
    "name": "upload_public_project",
    "group": "Public_Project",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Through our web application, you can publish your project publically. This will automatically generate the complete audio file and upload that audio file so that other user's can listen to your project.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "pubProj",
            "description": "<p>File of the project</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>Project ID of public project</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -X POST -F \"pubProj=@/path/to/picture/drums.mp3\" -b cookie.txt https://https://project-anything.herokuapp.com/project/:projectId/file/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Automatically generated id for project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the just created project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Username/googleId of current user</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>Current date specifying the created time of project</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "isPublic",
            "description": "<p>Indicates public/private status of project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "pubFile_id",
            "description": "<p>References public file id if public</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": true,
            "field": "publicDate",
            "description": "<p>References most recent date public</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"_id\": \"yyyyyyy\",\n     \"author\": \"Foobar\",\n     \"date\": \"2020-04-11T17:48:30.049+00:00\",\n     \"title\": \"Weird Vibes\",\n     \"isPublic\": \"true\",\n     \"pubFile_id\": \"abcabcabc\",\n     \"publicDate\": \"2020-04-11T17:48:30.049+00:00\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>Project ID must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>Project ID must be alphanumeric</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>Project: xxxxxxxxxxxx does not exist</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>ProjectId: xxxxxxxxxx does not belong to you</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 404 Bad Request\n\"You are not the owner of this project\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/public_project.js",
    "groupTitle": "Public_Project"
  },
  {
    "type": "delete",
    "url": "/track/:trackId/",
    "title": "Deletes a track",
    "version": "1.0.0",
    "name": "delete_track",
    "group": "Track",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Deletes the Track. Removes all tracks files as well.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trackId",
            "description": "<p>Id of track to delete</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X DELETE -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Track: xxxxxxxxxx has been deleted</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"Track: xxxxxxxxxx has been deleted\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotFound",
            "description": "<p>trackId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotValid",
            "description": "<p>trackId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourTrack",
            "description": "<p>TrackId: xxxxxxxxx does not belong to you</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "TrackNotFound",
            "description": "<p>Track: xxxxxxxxxxxx not found</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"TrackId: xxxxxxxxx does not belong to you\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/track.js",
    "groupTitle": "Track"
  },
  {
    "type": "get",
    "url": "/track/:trackId/file/",
    "title": "Get the track file",
    "version": "1.0.0",
    "name": "get_track",
    "group": "Track",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets the track file and downloads it. Also references the src for project to load the tracks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trackId",
            "description": "<p>Id of track</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/file/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "File",
            "optional": false,
            "field": "final_file",
            "description": "<p>The file of the track</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotFound",
            "description": "<p>trackId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotValid",
            "description": "<p>trackId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourTrack",
            "description": "<p>You are not the owner of this track</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "TrackNotFound",
            "description": "<p>TrackId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this track\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/track.js",
    "groupTitle": "Track"
  },
  {
    "type": "get",
    "url": "/track/:trackId/info/",
    "title": "Get the track object",
    "version": "1.0.0",
    "name": "track_info",
    "group": "Track",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Gets the track details including all the settings and name.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trackId",
            "description": "<p>Id of track</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/info/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>ID of project for track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>User that uploaded the track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gain",
            "description": "<p>Volume of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "muted",
            "description": "<p>Mute status of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "soloed",
            "description": "<p>Solo status of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>Start time of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeIn_shape",
            "description": "<p>Fade in shape of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeIn_duration",
            "description": "<p>Fade in duration of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeOut_shape",
            "description": "<p>Fade out shape of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeOut_duration",
            "description": "<p>Fade out duration of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cuein",
            "description": "<p>Start time of track in track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cueout",
            "description": "<p>End time of track in track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "waveOutLineColor",
            "description": "<p>Color of track wave in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "stereoPan",
            "description": "<p>StereoPan of track in project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"{\n     \"_id\": \"zzzzzzz\",\n     \"projectId\": \"xxxxxxx\",\n     \"author\": \"Foobar\",\n     \"name\": \"Track2\",\n     \"gain\": 1,\n     ...\n     \"stereoPan\": 0.5\n }\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotFound",
            "description": "<p>trackId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotValid",
            "description": "<p>trackId must be alphanumeric</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourTrack",
            "description": "<p>You are not the owner of this track</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "TrackNotFound",
            "description": "<p>TrackId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this track\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/track.js",
    "groupTitle": "Track"
  },
  {
    "type": "patch",
    "url": "/track/:trackId/",
    "title": "Update track settings",
    "version": "1.0.0",
    "name": "update_track_option",
    "group": "Track",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Updates a tracks information. The option must be one of: [name, gain, muted, soloed, start, fadeIn_shape, fadeIn_duration, fadeOut_shape, fadeOut_duration, cuein, cueout, waveOutlineColor, stereoPan].</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "trackId",
            "description": "<p>Id of track</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "option",
            "description": "<p>Option to be updated</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newValue",
            "description": "<p>New value of the option</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X PATCH -d '{\"muted\": \"true\"}' -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Succesfully changed option</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"Succesfully changed option\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotFound",
            "description": "<p>trackId must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "TrackIDNotValid",
            "description": "<p>trackId must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "OptionNotFound",
            "description": "<p>option must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "OptionNotValid",
            "description": "<p>option type is invalid, refer to API for valid option types</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "NewValueNotFound",
            "description": "<p>newValue must exist</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          },
          {
            "group": "401",
            "optional": false,
            "field": "NotYourTrack",
            "description": "<p>You are not the owner of this track</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "TrackNotFound",
            "description": "<p>TrackId: xxxxxxxxxxxx does not exist</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"You are not the owner of this track\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/track.js",
    "groupTitle": "Track"
  },
  {
    "type": "post",
    "url": "/upload_track/",
    "title": "Create a track",
    "version": "1.0.0",
    "name": "upload_audio_track",
    "group": "Track",
    "permission": [
      {
        "name": "public"
      }
    ],
    "description": "<p>Upload a track for the project. To upload this, you will need to create a form data through curl or use our web app to upload the track into a project.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "track",
            "description": "<p>file of the track</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>Project ID of track to be attatched to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name for track</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -X POST -F \"name=Drums\" -F \"track=@/path/to/picture/drums.mp3\" -F \"projectId:xxxx\" -b cookie.txt https://https://project-anything.herokuapp.com/upload_track/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>ID of track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "projectId",
            "description": "<p>ID of project for track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>User that uploaded the track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "gain",
            "description": "<p>Volume of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "muted",
            "description": "<p>Mute status of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "soloed",
            "description": "<p>Solo status of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>Start time of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeIn_shape",
            "description": "<p>Fade in shape of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeIn_duration",
            "description": "<p>Fade in duration of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeOut_shape",
            "description": "<p>Fade out shape of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "fadeOut_duration",
            "description": "<p>Fade out duration of track in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cuein",
            "description": "<p>Start time of track in track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "cueout",
            "description": "<p>End time of track in track</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "waveOutLineColor",
            "description": "<p>Color of track wave in project</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "stereoPan",
            "description": "<p>StereoPan of track in project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"_id\": \"yyyyyyyy\",\n     \"projectId\": \"xxxxxxx\",\n     \"author\": \"Foobar\",\n     \"name\": \"Track1\",\n     \"gain\": 1,\n     ...\n     \"stereoPan\": 0.5\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDNotFound",
            "description": "<p>Project ID must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "ProjectIDInvalid",
            "description": "<p>Project ID must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "NameNotFound",
            "description": "<p>Name must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "NameInvalid",
            "description": "<p>Name must be alphanumeric</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "ProjectNotFound",
            "description": "<p>Project: xxxxxxxxxxxx does not exist</p>"
          },
          {
            "group": "404",
            "optional": false,
            "field": "NotYourProject",
            "description": "<p>You are not the owner of this project</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 404 Bad Request\n\"You are not the owner of this project\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/track.js",
    "groupTitle": "Track"
  },
  {
    "type": "get",
    "url": "/user_name/",
    "title": "Gets full name of user",
    "version": "1.0.0",
    "name": "get_user_name",
    "group": "User",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Retrieves the full name of the currently logged in user. This is specified at register and if you signed in through google, this retrieves your family and given name from your google account.</p>",
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/user_name/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "givenName",
            "description": "<p>Given name of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "familyName",
            "description": "<p>Family name of user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"familyName\": \"Foo\",\n  \"givenName\": \"Bar\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/auth/google/",
    "title": "Sign in via google",
    "version": "1.0.0",
    "name": "sign_in_google",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "description": "<p>Signs in as a google user. In order to properly utilize this, you will need to log in through the homepage of the web application. Google log in cannot be done by console because they have a user interface that guides you through logging into google. Upon curling, you will recieve a re-direct url along with cookies that need to be used for google to confirm communication.</p>",
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET https://https://project-anything.herokuapp.com/auth/google/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>redirect to homepage.html</p>"
          }
        ]
      }
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/signin/",
    "title": "Sign in as a local user",
    "version": "1.0.0",
    "name": "sign_in_local",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "description": "<p>Signs in as a local user and returns the cookie. If using a web browser, cookie will be saved to browser. Otherwise please save the cookie and send it back when requesting for 'user' level requests.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the local user created</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password for the account</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X POST -d '{\"username\":\"Foobar\",\"password\":\"123\"}' -c cookie.txt  https://https://project-anything.herokuapp.com/signin/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>successfully logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"success\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "UsernameNotFound",
            "description": "<p>Username must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "UsernameInvalid",
            "description": "<p>Username must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "PasswordNotFound",
            "description": "<p>Password must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "PasswordInvalid",
            "description": "<p>Password must be 8 characters, 1 upercase letter, 1 lowercase and 1 number</p>"
          }
        ],
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "InvalidCredentials",
            "description": "<p>Incorrect username or password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Unauthorized\n\"Incorrect username or password\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/signout/",
    "title": "Sign out of current account",
    "version": "1.0.0",
    "name": "sign_out",
    "group": "User",
    "permission": [
      {
        "name": "user authenticated"
      }
    ],
    "description": "<p>Signs out of any logged in user. This means that if you were signed in through local or google, you will sign out of the current session. Provide the cookie and it will be destroyed.</p>",
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X GET -b cookie.txt -c cookie.txt https://https://project-anything.herokuapp.com/signout/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "success",
            "description": "<p>succesfully logged out</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\"succesfully logged out\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "NotSignedIn",
            "description": "<p>You are not logged in</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 401 Unauthorized\n\"Incorrect username or password\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/signup/",
    "title": "Create a local user",
    "version": "1.0.0",
    "name": "sign_up_local",
    "group": "User",
    "permission": [
      {
        "name": "public"
      }
    ],
    "description": "<p>Creates a local user account.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the local user created</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password for the account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "familyName",
            "description": "<p>Family Name of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "givenName",
            "description": "<p>Given Name of user</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Curl example",
        "content": "curl -H \"Content-Type: application/json\" -X POST -d '{\"familyName\":\"Foo\",\"givenName\":\"Bar\",\"username\":\"Foobar\",\"password\":\"123\"}' https://https://project-anything.herokuapp.com/signup/",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the local user created</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "familyName",
            "description": "<p>Family Name of user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "givenName",
            "description": "<p>Given Name of user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"username\": \"Foobar\",\n  \"familyName\": \"Foo\",\n  \"givenName\": \"Bar\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "400": [
          {
            "group": "400",
            "optional": false,
            "field": "FamilyNameNotFound",
            "description": "<p>familyName must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "FamilyNameInvalid",
            "description": "<p>family name must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "GivenNameNotFound",
            "description": "<p>givenName must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "GivenNameInvalid",
            "description": "<p>given name must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "UsernameNotFound",
            "description": "<p>Username must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "UsernameInvalid",
            "description": "<p>Username must be alphanumeric</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "PasswordNotFound",
            "description": "<p>Password must exist</p>"
          },
          {
            "group": "400",
            "optional": false,
            "field": "PasswordInvalid",
            "description": "<p>Password must be 8 characters, 1 upercase letter, 1 lowercase and 1 number</p>"
          }
        ],
        "409": [
          {
            "group": "409",
            "optional": false,
            "field": "UsernameExists",
            "description": "<p>username Foobar already exists</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Response (example):",
          "content": "HTTP/1.1 400 Bad Request\n\"familyName must exist\"",
          "type": "json"
        }
      ]
    },
    "filename": "routes/users.js",
    "groupTitle": "User"
  }
] });
