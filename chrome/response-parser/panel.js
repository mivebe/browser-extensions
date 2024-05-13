console.log('chrome', chrome);

const types = {};
chrome.devtools.network.onRequestFinished.addListener((param) => console.log(param));

chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes('action')) {
        const { response, metaData: { roundId } } = JSON.parse(body);
        const parsedResponse = JSON.parse(response);
        visualize({ roundId, response: parsedResponse });
      }
    }
  });
});


function visualize({ roundId, response }) {
  console.log(response);
  Array.from(document.body.children).forEach(child => child.remove());

  const container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);

  const title = document.createElement('h1');
  title.innerText = roundId;
  container.appendChild(title);

  displayEntries(response);

}

function displayEntries(object, key) {


  if (object.length) {
    const openRow = document.createElement('p');
    const closeRow = document.createElement('p');

    openRow.innerText = `${JSON.stringify(object)}: [\n`;
    document.getElementById('container').appendChild(openRow);

    object.length && object.forEach(child => displayEntries(child));

    closeRow.innerText = `\n]`;
    document.getElementById('container').appendChild(openRow);
  } else if (object.entries) {
    const openRow = document.createElement('p');
    const closeRow = document.createElement('p');

    openRow.innerText = `${JSON.stringify(object)}: {\n`;
    document.getElementById('container').appendChild(openRow);

    const entries = object.entries();
    entries.forEach(entry => displayEntries(entry, key));

    closeRow.innerText = `\n}`;
    document.getElementById('container').appendChild(openRow);
  } else {
    const element = document.createElement('p');
    element.innerText = `${JSON.stringify(object)}`;
    document.getElementById('container').appendChild(element);
  }

}