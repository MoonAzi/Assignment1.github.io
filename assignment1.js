/** 
  * Borrows some design elements of Lab 10 test your knowledge 5
  * 
  * @Author: Moonum Azmi 
  * @Class: COMP3512 
  *
 /*


var map;


/**
  * Initializes google map
  *
  */

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.89474, lng: 12.4839},
        zoom: 18 
    });
} 

/**
  * Automatically moves to location on google maps 
  * Functionality from https://stackoverflow.com/questions/12699300/move-google-map-center-javascript-api
  *
  * @param lat 
  * Passes in the latitude of location that is to be travelled to
  *
  * @param lng
  * Passes in the longitude of location that is to be travelled to
  *
  */

function moveLocation(lat, lng){
    
  const center = new google.maps.LatLng(lat, lng);
  // using global variable:
  window.map.panTo(center);
}


/**
  * Automatically moves to location on google maps 
  * Method borrowed from https://stackoverflow.com/questions/12699300/move-google-map-center-javascript-api
  *
  * @param map
  * Passes in map to perform google map functionality
  *
  * @param latitude
  * Passes in the latitude of location that is to be marked
  *
  * @param longitude
  * Passes in the longitude of location that is to be marked
  *
  * @param city
  * Passes in name of city to use as name
  *
  */

function createMarker(map, latitude, longitude, city) {
    
    let imageLatLong = {lat: latitude, lng: longitude };
    let marker = new google.maps.Marker({
        position: imageLatLong,
        title: city,
        map: map
    });
    document.getElementById('map')
}
 
document.addEventListener("DOMContentLoaded", function() { 
    
    //urls that are to be fetched and updated for their data on paintings and galleries 
    let url = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';
    let url2 = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=';
    let imageBoxURL = 'https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/square/';
    
    //fetch gallery data from url 
    //pass that data to populateGallery function 
    fetch(url)
    .then(response => response.json())
    .then(galleries => { 
        populateGallery(galleries); 
    })
    .catch( error => console.log(error));
    
    /**
      * Populates box b with fetched array of galleries 
      *
      * @param galleries 
      * Passes fetched array of galleries to populate gallery list 
      *
      */
    
    function populateGallery(galleries) {
        
        //make box b visible 
        document.querySelector(".box.b section").style.display = "block"; 
        
        //Select unordered list 
        //Populate it with list items that contain attribute data of gallery to pass on 
        let uList = document.querySelector('#galleryList');
        uList.innerHTML = "";
        
        //loop through galleries to produce list items of gallerys
        //contains information about particular gallery in it's attributes 
        galleries.forEach ( g  => {    
            let li = document.createElement('li'); 
            li.textContent = g.GalleryName;  
            li.setAttribute('natName', g.GalleryNativeName);
            li.setAttribute('city', g.GalleryCity);
            li.setAttribute('address', g.GalleryAddress);
            li.setAttribute('country', g.GalleryCountry); 
            li.setAttribute('home', g.GalleryWebSite);
            li.setAttribute('latitude', g.Latitude);
            li.setAttribute('longitude', g.Longitude);
            li.setAttribute('id', g.GalleryID);
            uList.appendChild(li);        
        });
         
        //adds event listeners on all list items so their attributes populate box a. 
        document.querySelectorAll("li").forEach(listItem => { 
            listItem.addEventListener('click', (e) => {
                
                //assign variables to transfer to galDetails function 
                let name = e.target.textContent; 
                let natName = e.target.getAttribute('natName');
                let city = e.target.getAttribute('city'); 
                let address = e.target.getAttribute('address'); 
                let country = e.target.getAttribute('country');
                let home = e.target.getAttribute('home'); 
                let lat = parseFloat(e.target.getAttribute('latitude')); 
                let lon = parseFloat(e.target.getAttribute('longitude'));  
                
                //Concat from https://www.w3schools.com/jsref/jsref_concat_string.asp
                //Combines url with id of paintings to generate a specific gallery's list of paintings 
                let url2Update = url2.concat(e.target.id);
                
                //calls several functions to fulfill rest of the functionality 
                galDetails(name, natName, city, address, country, home);
                createMarker(map, lat, lon, city);
                moveLocation(lat, lon);
                createPaintings(e.target, url2Update); 
            });
        });
     }
    
    /**
      * Generates and populates the details of galleries listed in Box a 
      *
      * @param name
      * Passes the name of the gallery
      *
      * @param native
      * Passes the local name of the gallery
      *
      * @param city
      * Passes the name of the city the gallery is located in
      *
      * @param address
      * Passes the exact address its located 
      *
      * @param country
      * Passes the name of the country the gallery is located 
      *
      * @param home
      * Passes an updated URL of paintings to 
      *
      */
    
    function galDetails(name, native, city, address, country, home) {
        
        //selects box a and programmatically alters the display to grid 
        document.querySelector('.box.a section').style.display = 'grid'; 
        
        //populates existing elements in HTML to populate box a 
        let detail1 = document.querySelector('#galleryName');
        detail1.textContent = name; 
        let detail2 = document.querySelector('#galleryNative');
        detail2.textContent = native; 
        let detail3 = document.querySelector('#galleryCity'); 
        detail3.textContent = city; 
        let detail4 = document.querySelector('#galleryAddress'); 
        detail4.textContent = address; 
        let detail5 = document.querySelector('#galleryCountry'); 
        detail5.textContent = country; 
        let detail6 = document.querySelector('#galleryHome'); 
        detail6.textContent = home;  
    }
    
    /**
      * Generates a table of paintings within box c 
      *
      * @param gallery    
      * Passes details about Gallery for eventual use of populating details of large painting box 
      *
      * @param url2Update 
      * Passes an updated URL of paintings to 
      *
      */
    
    function createPaintings(gallery, url2Update) { 
        
        //array that wil be essential in grabbing an array of paintings to manipulate and assign 
        let pTableSorter; 
        
        //generate table
        let table = document.querySelector('#paintingList');
        table.innerHTML = ""; 
        
        //distinguishes headings from body of table  
        let tableHeading = document.createElement('tHead'); 
        
        //generates area where headers are to be located 
        //headers are appended to this 
        let tHeader = document.createElement('tr');
        tHeader.setAttribute('id', "tableHeading");
    
        let imageHeading = document.createElement('th');
              
        let artist = document.createElement('th');
        artist.textContent = 'Artist'; 
                   
        let title = document.createElement('th');
        title.textContent = 'Title'; 
                
        let year = document.createElement('th');
        year.textContent = 'Year'; 
                
        //distinguishes table body elements from header 
        let tableBody = document.createElement('tbody'); 
              
        tHeader.appendChild(imageHeading);
        tHeader.appendChild(artist);
        tHeader.appendChild(title); 
        tHeader.appendChild(year); 
        tableHeading.appendChild(tHeader);
        table.appendChild(tableHeading);
        table.appendChild(tableBody);
              
        //fetches for paintings from a specific gallery
        fetch(url2Update) 
        .then(response => response.json())
        .then(paintings => {
            
            //grabs array of paintings from updated url2
            pTableSorter = Array.from(paintings); 
            
            //calls array to perform a default sort based on last names 
            artistLastNameSort(pTableSorter, gallery);
                    
            //events appended to headers to sort based on lastname, title or year          
            title.addEventListener('click', (e) => {
                titleSort(pTableSorter, gallery)
            });
            year.addEventListener('click', (e) => {
                yearSort(pTableSorter, gallery); 
            });
                    
        })
        .catch(error => console.log(error)); 
    }
      
    /**
      * Sorts based on an artist's last name when user selects heading "Artist"  
      *
      * @param pTableSorter   
      * Passes Array of paintings to sort 
      *
      * @param gallery    
      * Passes details about Gallery for eventual use of populating details of large painting box 
      *
      */
    
    function artistLastNameSort(pTableSorter, gallery) {
        
        //sorts based on last name 
        pTableSorter.sort( (a,b) => { 
                return a.LastName < b.LastName ? -1 : 1; 
        }); 
                
        paintingTableCreate(pTableSorter, gallery); 
    }
      
    /**
      * Sorts based on a painting title when user selects heading "Title"  
      *
      * @param pTableSorter   
      * Passes Array of paintings to sort  
      *
      * @param gallery    
      * Passes details about Gallery for eventual use of populating details of large painting box 
      *
      */
    
    function titleSort(pTableSorter, gallery) { 
        
        //sorts based on title
        pTableSorter.sort( (a,b) => { 
            return a.Title < b.Title ? -1 : 1; 
        }); 
                
         paintingTableCreate(pTableSorter, gallery); 
    }
    
    /**
      * Sorts based on year when user selects heading "Year"  
      *
      * @param pTableSorter   
      * Passes Array of paintings to sort  
      *
      * @param gallery    
      * Passes details about Gallery for eventual use of populating details of large painting box 
      *
      */
    
    function yearSort(pTableSorter, gallery) { 
        
        //sorts based on year         
        pTableSorter.sort( (a,b) => { 
            return a.YearOfWork < b.YearOfWork ? -1 : 1; 
        });
        
        paintingTableCreate(pTableSorter, gallery); 
    }
    
    /**
      * Generates a gallery of paintings to populate the paintbox  
      *
      * @param pArraySort   
      * Passes a sorted Array of paintings to populate the table 
      *
      * @param gallery    
      * Passes element gallery for event to transfer to largePaintingBox function
      *
      */
              
    function paintingTableCreate(pArraySort, gallery) {
         
        //creates tableBody to differentiate between contents and headings
        //empties itself to generate a new list based on a new passed sorted array
        let tableBody = document.querySelector('tbody');       
        tableBody.innerHTML = "";
        
        //iterates through sorted array
        //generates a table of paintings and associated values through passed value  
        pArraySort.forEach( p => {            
            let row = document.createElement('tr');
            row.setAttribute('id', 'tableRow');
       
            //produces cell where painting thumnails are to be located 
            let thumbnailCell = document.createElement('td');
            let thumbnail = document.createElement('img');
            thumbnail.setAttribute('src', imageBoxURL.concat(p.ImageFileName));
            thumbnail.setAttribute('class', 'link');
            thumbnail.setAttribute('id', p.PaintingID);
            thumbnailCell.appendChild(thumbnail);  
            
            //produces cell where artist names are to be listed 
            //if conditional to test whether said artist is referred to by only his last name or not
            let artistCell = document.createElement('td'); 
            if (p.FirstName == null) { 
                artistCell.textContent = p.LastName; 
            }
            else {  
                artistCell.textContent = (p.FirstName + " " + p.LastName); 
            }
            
            //produces titlecell where titles are to be listed             
            let titleCell = document.createElement('td');
            titleCell.setAttribute('id', 'title');
            titleCell.textContent = p.Title; 
            
            //produces yearcell where years are to be listed             
            let yearCell = document.createElement('td');
            yearCell.setAttribute('id', 'year'); 
            yearCell.textContent = p.YearOfWork;
                        
            row.appendChild(thumbnailCell); 
            row.appendChild(artistCell); 
            row.appendChild(titleCell); 
            row.appendChild(yearCell);
            tableBody.appendChild(row);  
            
            //display box c 
            document.querySelector(".box.c section").style.display = "block"; 
        }); 
                
        //creating event handlers for all thumbnails
        //additionally generating an updated URL for further passing 
        document.querySelectorAll(".link").forEach(rows => { 
            rows.addEventListener('click', (e) => { 
                let paintUrlUpdate = url2.replace("gallery=", "id=").concat(e.target.getAttribute('id'));
                paintBigWindow(e.target.src, paintUrlUpdate, gallery);
            });
        });
    }    
    
    /**
      * Generates the large painting view 
      *
      * @param imagePath   
      * Passes the filepath of the target image 
      *
      * @param paintUrlUpdate   
      * Passes a URl to fetch data from an array to populate details with
      *
      * @param gallery    
      * Passes details about Gallery to eventually populate
      *
      */
    
    function paintBigWindow(imagePath, paintUrlUpdate, gallery) {
        
        //array that will contain an array of painting         
        let paintArray; 
                
        let main = document.querySelector('main');  
                
        let div = document.createElement('div');
        div.setAttribute('class', "box e");
        div.innerHTML = ""; 
                
        let sect = document.createElement('section');
                
        let imageBody = document.createElement('div'); 
        imageBody.setAttribute('id', 'imgBody'); 
                
        let textBody = document.createElement('div'); 
        textBody.setAttribute('id', 'txtBody'); 
                
        sect.appendChild(imageBody);
        sect.appendChild(textBody); 
        div.appendChild(sect); 
        main.appendChild(div); 
                
        fetch(paintUrlUpdate)
        .then(response => response.json())
        .then(painting => { 
            
            //paintArray will allow access to details to populate details
            //sent as parameter to populate box 
            paintArray = Array.from(painting); 
            //will generate 
            populateBox(imagePath, paintArray, gallery);
        })
        .catch(error => console.log(error)); 
    }
    
    /**
      * Populates the generated large painting view, substantiating it with details  
      *
      * @param imagePath   
      * Passes the filepath of the target image
      *
      * @param paintArray   
      * Passes an Array of a painting to populate the details with  
      *
      * @param gallery    
      * Passes details about Gallery to further populate
      *
      */
    
    function populateBox(imagePath, paintArray, gallery) { 
        
        //Differentiates image from text 
        //empties if elements are present within 
        imageBody = document.querySelector('#imgBody');
        imageBody.innerHTML = ""; 
        
        //differentiates text from image 
        //empties if elements are present within 
        textBody = document.querySelector('#txtBody'); 
        textBody.innerHTML = ""; 
        
        //iterates through paintArray to populate details of a single painting for larger painting view 
        paintArray.forEach(p => {                     
            let medImg = document.createElement('img'); 
            medImg.setAttribute('src', imagePath.replace("w_75", "w_450"));
            medImg.setAttribute('id', 'medImg');
                    
            let h1 = document.createElement('h1');
            h1.textContent = p.Title;
                
            let h2 = document.createElement('h2'); 
            if (p.FirstName == null) { 
                h2.textContent = p.LastName;
            } 
            else { 
                h2.textContent = p.FirstName.concat(" " + p.LastName); 
            }
                
            let uL = document.createElement('ul'); 
            uL.setAttribute('class', 'uList2');
                                    
            let liMed = document.createElement('li'); 
            liMed.textContent = "Type of painting: " + p.Medium;
                
            let liWid = document.createElement('li'); 
            liWid.textContent = "Width: " + p.Width;
                
            let liHei = document.createElement('li'); 
            liHei.textContent = "Height: " + p.Height;
                
            let liCop = document.createElement('li'); 
            liCop.textContent = "Copyright Status: " + p.CopyrightText;
                
            let liGalName = document.createElement('li'); 
            liGalName.textContent = "Located at: " + gallery.getAttribute('natname');
                
            let liGalCity = document.createElement('li'); 
            liGalCity.textContent = "Gallery Location: " + gallery.getAttribute('city');
                
            let liLink = document.createElement('li'); 
            let actualLink = document.createElement('a'); 
            actualLink.setAttribute('href', gallery.getAttribute('home'));
            actualLink.textContent = gallery.getAttribute('home');
            liLink.appendChild(actualLink);
                
            let liDesc = document.createElement('li'); 
            liDesc.textContent = p.Description;
            console.log(p.Description);
            
            //color is an array that contains an array pertaining to the colors of a painting 
            //eventually passed to function createColorBox alongside textBody
            let color = Array.from(p.JsonAnnotations.dominantColors) 
                    
            let closeButton = document.createElement('button');
            closeButton.setAttribute('type', 'button'); 
            closeButton.setAttribute('id', 'close');
            closeButton.textContent = "Close"; 
                    
            imageBody.appendChild(medImg);
            textBody.appendChild(h1); 
            textBody.appendChild(h2); 
            uL.appendChild(liMed); 
            uL.appendChild(liWid);
            uL.appendChild(liHei);
            uL.appendChild(liCop);
            uL.appendChild(liGalName);
            uL.appendChild(liGalCity);
            uL.appendChild(liLink);
            if (p.Description != null) { 
                uL.appendChild(liDesc);
            }
            textBody.appendChild(uL);
            createColorBox(textBody, color);
            textBody.appendChild(closeButton); 
            
            //turns off visibility of other boxes except e         
            displayBox(); 
          
            //adds an event to the image 
            //when clicked on, will generate a modal image box 
            medImg.addEventListener('click', (e) => { 
                modalImgGen(e.target); 
            });
                
            //adds an event to the close button
            //when pressed, exits large painting view and goes to default page 
            document.querySelector('#close').addEventListener('click', (e) => { 
                removeBox(); 
            }); 
                    
        });
    }
    
    
    /**
      * Generates color boxes
      *
      * @param textBody   
      * Passes the textBody element for the generated boxes to be appended to
      *
      * @param colors
      * Passes an array of colors to loop through and generate colors
      *
      */
    
    function createColorBox (textBody, colors) { 
        
        //iterate through colors array in order to produce small div boxes 
        //colored div will be appended to passed in element 
        colors.forEach( c => { 
            let colorBox = document.createElement('div'); 
            colorBox.setAttribute('class', 'colorBox'); 
            colorBox.style.backgroundColor = c.web; 
            textBody.appendChild(colorBox); 
        });
        textBody.appendChild(document.createElement('br'));
    }
    
    /**
      * Toggles visiblity of box e while shutting down other boxes 
      *
      */
    
    function displayBox() { 
        
        document.querySelector('.box.a').style.display = 'none';
        document.querySelector('.box.b').style.display = 'none';
        document.querySelector('.box.c').style.display = 'none';
        document.querySelector('.box.d').style.display = 'none';
        document.querySelector('.box.e').style.display = 'block';
    }
    
    /**
      * Toggles visiblity of every box except e
      *
      */
    
    function removeBox() { 
        
        document.querySelector('.box.a').style.display = 'block';
        document.querySelector('.box.b').style.display = 'block';
        document.querySelector('.box.c').style.display = 'block';
        document.querySelector('.box.d').style.display = 'block';
        document.querySelector('.box.e').style.display = 'none';
    }
    
    /**
      * Generates a modal image 
      *
      * @param image   
      * Passes the filepath of the target image
      *
      */
    
    function modalImgGen(image) { 
        
        //selects main element to append modal box to       
        let main = document.querySelector('main'); 
        
        //generates modal box
        let modal = document.createElement("div");
        modal.setAttribute('class', 'modal');
        
        //generates contents of list 
        let modalContent = document.createElement('div'); 
        modalContent.setAttribute('id', 'modalContent'); 
        
        //creates a larger version of the image that
        modalImg = document.createElement('img'); 
        modalImg.setAttribute('id', 'imgMod');
        modalImg.setAttribute('src', image.getAttribute('src').replace("w_450", "w_650"));
                    
        modalContent.appendChild(modalImg);
        modal.appendChild(modalContent); 
        main.appendChild(modal);
        
        //changes modal from being invisible ot visible 
        modal.style.display = "block"; 
                
        modalImg.addEventListener('click', (e) => { 
            modal.style.display = 'none';
        }); 
    }
        
});
 
        


 
    