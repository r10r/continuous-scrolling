/* TODO 
 - implement partial chunk loading and events queue
 - cancel loading of chunk if the scroll position changes to fast
 - proper encapsulation
*/

// bind scrolling function to all continuous scrolling containers
$(".scroll-container").bind("scroll", function(){preloadElements(this);});

// calculate the chunk heights
var initialChunkCollapsedMargins = (initialItemsToLoad - 1) * itemMargin
var initialChunkHeight = (initialItemsToLoad * itemHeight) - initialChunkCollapsedMargins;
var chunkCollapsedMargins = (itemsPerChunk + 1) * itemMargin;
var chunkHeight = (itemsPerChunk * itemHeight) - chunkCollapsedMargins; 
var initialChunkOffset = initialChunkHeight - chunkHeight;

var loadedChunks = []; // the chunks already loaded
var loadingChunks = []; // the chunks currently loading

var simulationDelay = 500;

function preloadElements(scrollContainer) {
	var chunkIndex = getChunkIndex(scrollContainer);
	console.log("selected chunk: " + chunkIndex); 

	setTimeout(function() {
			if (chunkIndex == getChunkIndex(scrollContainer)) {
				safeLoad(chunkIndex - 1);
				safeLoad(chunkIndex);
				safeLoad(chunkIndex + 1);
			} else {
				console.log("loading timeout for chunk: " + chunkIndex);
			}
		}, loadDelay);
}

function safeLoad(chunkIndex) {
	if (isNotLoaded(chunkIndex)) {
		loadingChunks.push(chunkIndex);
		// for testing purposes, use setTimeout to simulate HTTP transmission delay
		setTimeout(function(){ loadChunk(chunkIndex, itemsPerChunk); }, simulationDelay);					
	}
}

function isNotLoaded(chunkIndex) {
	if (chunkIndex < 0) {
		return false;
	} else {
		return !isLoading(chunkIndex) && !isLoaded(chunkIndex);
	}
}

function isLoaded(chunkIndex) {
	return _.indexOf(loadedChunks, chunkIndex) > -1;
}

function isLoading(chunkIndex) {
	return _.indexOf(loadingChunks, chunkIndex) > -1;
}

function getChunkIndex(scrollContainer) {
	// http://www.quirksmode.org/dom/w3c_cssom.html#elementview, content field height including padding
	//var scrollContainerHeight = scrollContainer.clientHeight;

	var scrollBarPosition = scrollContainer.scrollTop; // position of scrollbar
	//console.log("scrollbar position: " + scrollBarPosition);

	// increment active chunk by one since the first chunk is initially loaded
	// remove the offset of the first chunk
	// toFixed returns a string, therefore we have to call parseInt to make to calculation work
	var diff = scrollBarPosition - initialChunkOffset;
	
	if (diff > 0) {
		return parseInt((diff / chunkHeight).toFixed(0));
	} else {
		return 0;
	}
}

function loadChunk(chunkIndex, itemCount) {
	 // retrieve the chunk container
	var chunkContainerSelector = '.chunk[data-index="' + chunkIndex + '"]';
	console.log("loading chunk container for selector: " + chunkContainerSelector);
	var chunkContainer = $(chunkContainerSelector);
	
	// append the callback return value to the chunk container
	chunkContainer.replaceWith(loadChunkContent(chunkIndex, itemCount));
	
	// remove from loading chunks again
	loadedChunks.push(chunkIndex);
	loadingChunks = _.without(loadingChunks, chunkIndex);
	
}

function loadChunkContent(chunkIndex, items) {
	var itemTemplate = '<% _.each(items, function(item) { %> <li>chunk <%= chunkIndex %>.<%= item %></li> <% }); %>';
	return _.template(itemTemplate, {'items' : _.range(items), 'chunkIndex' : chunkIndex});
}
