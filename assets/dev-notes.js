(async () => {
    const response = await fetch('https://api.github.com/repos/eightbitraptor/wiki/contents/');
    const data = await response.json();
    let htmlString = '<ul>';

    for (let file of data) {
      htmlString += `<li><a href="${file.path}">${file.name}</a></li>`;
    }

    htmlString += '</ul>';
    document.getElementsByTagName('body')[0].innerHTML = htmlString;
  })()
