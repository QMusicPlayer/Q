FROM node
RUN mkdir app

# This command makes `/app/` the current working directory. You can assume you are 'inside' that directory for all following commands
WORKDIR app

# TODO: ADD all the application code into /app
ADD . /app

# TODO: RUN `npm install`
RUN npm install

EXPOSE 8000 
CMD ["npm", "start"] 
