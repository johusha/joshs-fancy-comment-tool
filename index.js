const COMMENT_CHAR = '*';
const PADDING_CHAR = ' ';
const PADDING_SIZE = 0;
const JUSTIFY_CONTENT = 'center';
const COMMENT_WIDTH = 60;

document.onreadystatechange = event => {
  if (event.target.readyState !== 'complete') { return }
  
    try {
    const content = [
      {
        text: "Josh's Fancy Comment Tool",
        justify: 'center', // left, right, center
      },
      "Hacked together by Josh",
      "https://github.com/johusha"
    ];
    
    // Make sure characters are actually 1 char in length
    if (
      PADDING_CHAR.length > 1 || PADDING_CHAR.length < 1 ||
      COMMENT_CHAR.length > 1 || COMMENT_CHAR.length < 1
    ) {
      printDebug(`COMMENT_CHAR: ${COMMENT_CHAR}`);
      printDebug(`PADDING_CHAR: ${PADDING_CHAR}`);
      throw new Error('Comment and padding must be 1 character');
    }
    
    let commentLines = '';
    
    // Just in case the user passes in a single string
    if (typeof content == 'string') {
      content = [ content ];
    }
    
    // Get the minimum width of the text inside the comment
    let minWidth = COMMENT_WIDTH;
    
    // Get the length of the longest line
    for (let i=0; i < content.length; i++) {
      const entry = content[i];
      const contentText = entry.text || entry;
      
      minWidth = Math.max(minWidth, contentText.length);
    }
    
    // Prevent long-running script
    if (minWidth + PADDING_SIZE > 499) {
      printDebug(`minWidth: ${minWidth}`);
      throw new Error('Comment width too long. Stop trying to break my script!');
    }
    
    // Iterate over comment text array and generate a string for each line
    for (let i=0; i < content.length; i++) {
      if (i > 0) commentLines += '\n'
      
      const entry = content[i];
      const contentText = entry.text || entry;
      const contentJustify = entry.justify
      const contentPadding = entry.padding;
      
      const generated_string = generateCommentLineString(contentText, minWidth, contentJustify, contentPadding);
      
      // Append generated string to new line
      commentLines += generated_string;
    }
    
    // Dynamically generate frame strings
    // Add 2 to comment width for padding
    const generated_frame_string_top = repeatString(COMMENT_CHAR, minWidth + (PADDING_SIZE * 2));
    const generated_frame_string_bottom = repeatString(COMMENT_CHAR, minWidth + (PADDING_SIZE * 2));
    
    // String literals make multiple lines easy!
    // let comment = [`/*${generated_frame_string_top}${COMMENT_CHAR}`,
    //   `${commentLines}`,
    //   ` ${COMMENT_CHAR}${generated_frame_string_bottom}*/`
    // ].join('/n')
    let comment =
      `\/*${generated_frame_string_top}${COMMENT_CHAR}\n` +
      `${commentLines}\n` +
      ` ${COMMENT_CHAR}${generated_frame_string_bottom}*/`

    // Print to the console
    // console.clear();
    console.log(comment);
    
    // Convert new lines to <br> for rendering in the dom and remove first line break
    comment = comment.replace(/(?:\r\n|\r|\n)/g, '<br>').substring(4);
    comment = comment.substring(0, comment.length - 4)
    
    // Output to div for easy copypasta
    document.getElementById('output').innerHTML = ' ' + comment;
    document.getElementById('message').appendChild(document.createTextNode("Here's your fancy comment! (It looks better in the console)"));
    
    // Nothing went wrong so hide the error div
    document.getElementById('error').style.setProperty('display', 'none');
    
  } catch (err) {
    const errorNode = document.createTextNode(err);
    document.getElementById('error')?.appendChild(errorNode);  
    console.error(err);
  }
}

function printDebug(msg) {
  const node = document.createTextNode(msg);
  const linebreak = document.createElement('br');
  document.getElementById('debug').appendChild(node);
  document.getElementById('debug').appendChild(linebreak)
  document.getElementById('debug').style.setProperty('display', 'block')
  console.log(msg);
}

function generateEmptyCommentString() {
  
}

function calculateTextWidthInPixels(str) {
  
}

function generateCommentLineString(str, width = COMMENT_WIDTH, justify = JUSTIFY_CONTENT, padding = PADDING_CHAR) {

  // Calculate padding for text position
  const paddingLength = (width - str.length);
  
  let paddingLeft = '';
  let paddingRight = '';
  
  switch (justify.toUpperCase()) {
    case 'LEFT':
      paddingRight = repeatString(padding, paddingLength);
      break;
    case 'RIGHT':
      paddingLeft = repeatString(padding, paddingLength);
      break;
    case 'CENTER':
      paddingLeft = repeatString(padding, paddingLength / 2)
      paddingRight = repeatString(padding, Math.ceil(paddingLength / 2));
      break;
  }

  return ` ${COMMENT_CHAR}${paddingLeft}${str}${paddingRight}${COMMENT_CHAR}`
}

function repeatString(pattern, count) {
    if (count < 1) return '';
    let result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
}