var siteUrl = "{{"index.json" | absURL}}?nocache=" + (new Date()).toISOString().slice(0,10);

var searchModal = document.getElementById("searchModal");
var launchers = document.getElementsByClassName("search-launcher");
console.log(launchers)
document.getElementById("closeModal").addEventListener("click", toggleModal);

for (var i = 0; i < launchers.length; i++) {
  launchers[i].addEventListener('click', toggleModal);
}

var modalBg = document.getElementsByClassName("modal-background");
for (var i = 0; i < modalBg.length; i++) {
  modalBg[i].addEventListener('click', toggleModal);
}

function toggleModal() {
  if(searchModal.classList.contains("is-active")) {
    searchModal.classList.remove("is-active")
  } else {
    var site = getSiteData(siteUrl);
    searchModal.classList.add("is-active")
  }
  
}

function getSiteData(url) {
  fetch(url)
  .then(function(response) {
    return response.json()
  })
  .then(function(data){
    var pages = data.pages;
    
    var idx = lunr(function () {
      this.ref('i');
      this.field('contents');
      this.field('summary');
      this.field('title');
      this.metadataWhitelist = ['position', 'title'];
      
      pages.forEach(function (doc) {this.add(doc)}, this)
      
    });
    var searchButton = document.getElementById("searchButton");
        searchButton.addEventListener("click", search);
    
    function search() {
      var searchbox = document.getElementById("searchbox");
      var term = searchbox.value;
      
      document.getElementById("searchResults").innerHTML = "";
      
      var results = idx.search(term);
          results.forEach(populateResults);
      
      var stats = document.getElementById("searchStats");
      stats.innerHTML = `Searching for <em>${term}</em> returned ${results.length} results`
      
    }
    
    var clearBtn = document.getElementById("clearModal");
        clearBtn.addEventListener("click", clearResults);
    
    // also clear results when closing modal 
    document.getElementById("closeModal").addEventListener("click", clearResults);
    
    function clearResults() {
      var clear = document.getElementById("searchResults");     
    
      while (clear.hasChildNodes()) {
        clear.removeChild(clear.lastChild);
      }
      document.getElementById("searchbox").value = "";
      document.getElementById("searchStats").innerHTML = "";
    }
    
    
    
    function populateResults(x) {
      var node = document.createElement("LI");                 
      var el = pages[x.ref];
      var res = `<li><a href="${el.permalink}">${el.title}</a></li>`
      //var textnode = document.createTextNode(res); 

      //node.appendChild(textnode);                              
      //document.getElementById("searchResults").appendChild(node);     
      document.getElementById("searchResults").innerHTML += res;
    }
    
  })
  .catch(function(error) {
      console.log('ERROR in getData: ', error);
  }); 
}
