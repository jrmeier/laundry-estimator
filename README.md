# Laundry Estimator

Do you ever wonder how much laundry you actually do? With this tool, you can simply upload your photos and it will attempt the number of each type of clothing in the photos and give you an estimate of how much laundry you do based on the average washing machine capacity.

## Built With

* Node.js/TypeScript
* React
* RoboFlow Infer API

## Getting Started

To use the app, simply navigate to [Laundry Estimator](https://jrmeier.github.io/laundry-estimator). You'll want to use the link I emailed, as the API key is required and pulled from the URL params.

If you want to install it and modify the code:

1. Clone the repo
2. Navigate to the repo
3. Install dependencies
4. Start the app

Copy and paste the following into your terminal:

```sh
git@github.com:jrmeier/laundry-estimator.git
cd laundry-estimator
npm i
npm start
```

## Motivations

The reason I chose this as the project was because I've also wanted a robot to do my laundry. Essentially, I would love to be able to create a robot with some arms based off of a RC car. It would drive into a room, recognize all the laundry, create a plan, then physically sort it, and then literally pick it up, put it in the washer, start it, transfer it to the dryer, start the dryer, and then fold it and put it away. Obviously this is a huge project, but that's my overall vision for it. Starting by just recognizing the type and amount of laundry is a good first step and the rest of the project is based on being able to do this well. Building a web app that shows the results of the model is a good way to use Roboflow and demonstrate some basic React skills.

## Results

Obviously, this is a toy application, but it was a fun way to learn about the RoboFlow platform and Inference API and to play around with React. I wasn't sure how well the different types of laundry would be detected, and it turns out I don't have very many clothes, so generating enough data to train the model was a bit of a challenge. In retrospect, I should have chosen something more generic, like clothes hanging in a closet, drawers, etc. My technique of taking photos "randomly" laid out, on the same bedding turned out to be a major problem. You'll notice that most photos end up being 95% a shirt, which is not very useful or accurate. Essentially, the bedding is in every single photo, which happened to be over trained with "Shirt", so the more bedding in the photo, the more likely the model will detect "Shirt". I also realized how little clothing I have myself, which severely limits the amount of training and tuning I can do for the project. I looked far and wide on the Roboflow Universe for a suitable dataset, but wasn't able to find any. I didn't realize how important it is to consider that right away in the project. The model doesn't perform well, but I did improve a few of the key metrics by applying a ton of transformations to photos. However, I think some of them such as the "cut out" feature exacerbated the overfitting issue since it would cut out parts of the labeled clothes, but was just the background, which was mostly bedding.

## Future features

* have a streaming camera that detects laundry as it comes in. Removing the need to take photos.
  * I know this is a feature of Roboflow, but I thought it would be too complex to implement initially. After doing this, I think it would have been about the same amount of work.
* have a "sort" plan that groups the laundry into piles of similar clothing
* utilize other datasets to detect how to wash the clothes
  * I see TONS of these on the Roboflow Universe
* have a "robot" that can physically handle the laundry
  * I have a few ideas on how to do this, but I think it would be a lot of work
* implement the in browser interference via the custom tensorflow implementation

## Issues

* I wasn't able to implement the in browser inference feature [deploy to browser](https://docs.roboflow.com/deploy/web-browser). Just following the example, I kept getting an error when calling `roboflow.auth...`, so I was never able to authenticate or get the model. I didn't spend too much time on this and it's highly likely I just missed something simple, since the documentation is straightforward.
* Image size errors - 413 request entity too large
  * After I built the first version, I uploaded some photos, but they ended up being too large to send the the Infer API. I ended up adding a resize feature which solves the problem. However, I did reference the [full stack app on codepen](https://codepen.io/roboflow/pen/VwaKXdM) and didn't see any image resizing, so I'm not sure how that's working.
  * I think the browser inference would solve this and make it a non-issue.
  * I used a simple image resizer found on NPM, to resize the images before enconding them and sending to Roboflow.
* I didn't realize how important it is to have a good dataset. I think this is the most important part of the project and I should have spent more time on it. I should have taken more photos of my own clothes, my fiance's clothes, and in many different places with many different backgrounds.
* Sometimes I get a 500 error from the Roboflow infer API, this is probably due to calling all the images at once. I believe this problem shouldn't be solved and instead the inference should happen on the client side.
* Some of the examples in the documentation don't work as expected.
  * example: on the "Deploy" page of my project, the CURL example doesn't work as it. All that is missing is the `-i` flag
