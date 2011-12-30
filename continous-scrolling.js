// load first chunk
loadChunk(0, 6);

// TODO implement partial chunk loading and events queue

// bind scrolling function to all continuous scrolling containers
$(".scroll-container").bind("scroll", function(){preloadElements(this);});

var initialChunkHeight = 265;
var chunkHeight = 185;
var initialOffset = initialChunkHeight - chunkHeight;
var previousLoadedChunk = 0;

function preloadElements(scrollContainer) {
	
	//var scrollContainerHeight = scrollContainer.clientHeight; // http://www.quirksmode.org/dom/w3c_cssom.html#elementview, content field height including padding
	var scrollBarPosition = scrollContainer.scrollTop; // position of scrollbar

	// increment active chunk by one since the first chunk is initially loaded
	// remove the offset of the first chunk
	// toFixed returns a string, therefore we have to call parseInt to make to calculation work
	var currentChunk = 1 + parseInt(((scrollBarPosition - initialOffset) / chunkHeight).toFixed(0));
	
	if (currentChunk > previousLoadedChunk) {
		console.log("scrollbar position: " + scrollBarPosition);
		// for testing purposes, use setTimeout to simulate HTTP transmission delay
		setTimeout(function(){ loadChunk(currentChunk, 4); }, 500);
//		loadChunk(currentChunk, 4);
		previousLoadedChunk = currentChunk;
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
}

function loadChunkContent(chunkIndex, items) {
	var itemTemplate = '<% _.each(items, function(item) { %> <li class="scroll-item">chunk <%= chunkIndex %>.<%= item %></li> <% }); %>';
	return _.template(itemTemplate, {'items' : _.range(items), 'chunkIndex' : chunkIndex});
}
