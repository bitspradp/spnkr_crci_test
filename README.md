# SaaS_UX_test
SaaS UX test repo 

[![Packages Build Status](https://circleci.com/gh/extremenetworks/saas_ux_test/tree/master.svg?style=shield&circle-token=b619b21089647f85e198d5392e946a3c0fec7637)](https://circleci.com/gh/extremenetworks/saas_ux_test) [![Join our community Slack](https://stackstorm-community.herokuapp.com/badge.svg)](https://stackstorm.com/community-signup)

## Building SaaS UI docker image

### Dev Build
* clone the source code use git clone <repo URL> (Ex: https://github.com/extremenetworks/saas_ux_test)
* cd to rest folder
* Docker build - Run command to compile and create a image "docker build -t <PROJECT_USERNAME>/<PROJECT_REPONAME>:<version> .". (Ex: docker build -t extremenetworks/saas_ux_test:dev .)
* Save the image to the local file-system using command "docker save -o <tar_folder>/<PROJECT_REPONAME>.tar <PROJECT_USERNAME>/<PROJECT_REPONAME>". (Ex: docker save -o tar/saas_ux_test.tar extremenetworks/saas_ux_test)
* Login to docker hub from user local node - docker login -u <DOCKER_USER> -p <DOCKER_PASSWORD>
* Deploy the image to docker hub - "docker push <PROJECT_USERNAME>/<PROJECT_REPONAME>:<version>". (Ex: docker push extremenetworks/saas_ux_test:dev)

### Dev CI
The recommended approach is to run test inside docker containers so your dev machine is not polluted. Also, this is close to what circle ci does with running tests inside a container.

To run tests with docker on your dev machine, please have [docker](https://docs.docker.com/) and docker compose installed.

To run tests, do "docker-compose -f docker-compose-tests.yml up --build --exit-code-from tests"

## CI
Continuous Integration (CI) is the process of automating the build and testing of code every time a
team member commits changes to version control (GitHub).

#### Build
Our build is automated via CircleCI workflows, which create a docker container with the docker:stable version, checkout the source code from the github branch specified, compile the code and will create a image. The created image will be exported to a tar format on the local file-system of the container.

#### Test
In parallel our build will also execute the mocha test cases with a seperate docker container which will checkout the source code and run the "npm install" and the "npm test from the "rest" folder. Please note to have the npm install run from the rest folder as there is a package.json which has the package info and the subsequent version that need to be installed for the test to continue.

Once the build and test are finished, they are visible via [red/green in PR status]

#### Deploy
Post the build and test task are completed successfully the github PR status will be updated as "All checks have passed" with a (GREEN check kick).

Our PR's would need atleast one reviewer to approve the PR and post that it will enable the "merge pull request". ON merging the changes to "master", the deploy task will post load the image tar created as part of the build task and post it to the docker hub.

When more in-depth investigation is needed, it's suggested to run the build locally.

## Testcase execution Information
Information related to automated tests for the rest interface can be found in rest folder under rest/test.
