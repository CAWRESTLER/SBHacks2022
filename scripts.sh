#!/usr/bin/env bash
case $1 in
    install )
        if ! command -v poetry &> /dev/null
        then
            echo "Poetry could not be found, please install it: https://python-poetry.org/docs/"
        exit
        elif ! command -v npm &> /dev/null
             then
                echo "npm/Node could not be found, please install it: https://nodejs.dev/learn/how-to-install-nodejs"
        else
            poetry install
            (cd ./frontend/; npm install)
        fi;;
    serve ) python3 ./wsgi.py;;
    frontend-serve ) (cd ./frontend/; npm start);;
    frontend-build ) (cd ./frontend/; npm run build; cp -r build/ ../src/);;
    test-backend ) TESTING=True poetry run pytest;;
    format ) poetry run black .;;
    expt-req ) poetry export -f requirements.txt --output requirements.txt;;
    *) echo "Please enter a command of:
            install(installs the required dependencies),
            serve(serve the backend flask app),
            frontend-serve(serves the frontend react)
            format(formats the code)
            expt-req(exports the requirements.txt file for deployment)
            frontend-build(builds the frontend for production)";;
esac
