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
var chunkCollapsedMargins = (itemsPerChunk -1) * itemMargin;
var chunkHeight = (itemsPerChunk * itemHeight) - chunkCollapsedMargins; 
var initialChunkOffset = initialChunkHeight - chunkHeight;

var loadedChunks = []; // the chunks already loaded
var loadingChunks = []; // the chunks currently loading

function preloadElements(scrollContainer) {
	
	//var scrollContainerHeight = scrollContainer.clientHeight; // http://www.quirksmode.org/dom/w3c_cssom.html#elementview, content field height including padding
	var scrollBarPosition = scrollContainer.scrollTop; // position of scrollbar

	// increment active chunk by one since the first chunk is initially loaded
	// remove the offset of the first chunk
	// toFixed returns a string, therefore we have to call parseInt to make to calculation work
	var chunkIndex = 1 + parseInt(((scrollBarPosition - initialChunkOffset) / chunkHeight).toFixed(0));
	
	var isLoading = _.indexOf(loadingChunks, chunkIndex) > -1;
	var isLoaded = _.indexOf(loadedChunks, chunkIndex) > -1;
	
	if (!isLoading && !isLoaded) {
		loadingChunks.push(chunkIndex);
		console.log("scrollbar position: " + scrollBarPosition);
		// for testing purposes, use setTimeout to simulate HTTP transmission delay
		setTimeout(function(){ loadChunk(chunkIndex, itemsPerChunk); }, 500);
	}
}

function loadChunk(chunkIndex, itemCount) {
	var chunkContainerSelector = '.chunk[data-index="' + chunkIndex + '"]';
	 // retrieve the chunk container
	 console.log("loading chunk container: " + chunkContainerSelector);
	
	// replace content of chunk container
	var chunkContainer = $(chunkContainerSelector);
	
	// execute the callback that returns the chunks content
	chunkContainer.append(loadChunkContent(chunkIndex, itemCount));

	// mark the chunk as loaded
	loadedChunks.push(chunkIndex);
	loadingChunks = _.without(loadingChunks, chunkIndex);
	console.log("loaded chunks: " + loadedChunks);
}

function loadChunkContent(chunkIndex, items) {
	var itemTemplate = '<% _.each(items, function(item) { %> <li class="scroll-item">chunk <%= chunkIndex %>.<%= item %></li> <% }); %>';
	return _.template(itemTemplate, {'items' : _.range(items), 'chunkIndex' : chunkIndex});
}
