/**
 * @author nstelt3@illinois.edu (Nolan Stelter)
 */


/** Iteratively generate terrain from numeric inputs and execute diamond square terrain generation algorithm
 * @param {number} n size of plane (number of points per side)
 * @param {number} minX Minimum X value
 * @param {number} maxX Maximum X value
 * @param {number} minY Minimum Y value
 * @param {number} maxY Maximum Y value
 * @param {Array} vertexArray Array that will contain vertices generated
 * @param {Array} faceArray Array that will contain faces generated
 * @param {Array} normalArray Array that will contain normals generated
 * @return {number}
 */
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray)
{
	for (var i = 0; i<4000; i++)
		normalArray[i] = 0;

    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(0);
       }
       
	//convert coords from 1D array to 2D array for easier manipulation in diamond square algoritm
	var counter = 2; 
	var items = new Array(n);
	for(var i = 0; i <= n; i++)
	{
 		items[i] = new Array(n); 
		for(var j = 0; j <= n; j++)
		{
			items[i][j] = vertexArray[counter]; 
			counter += 3;  
		}
	}


	//set 4 initial corner points
    items[0][0] = 0.02;
	items[0][n-1] = 0.05; 
	items[n-1][0] = 0.07; 
	items[n-1][n-1] = 0.05; 

	//diamond square algorithm executed here
	diamond_square(Math.log2(n-1), items, 0, 0, n-1, 0, 0, n-1, n-1, n-1); 

	counter = 2;
	for(var i = 0; i <= n; i++)
	{
		for(var j = 0; j <= n; j++)
		{
			vertexArray[counter] = items[i][j];   
			counter += 3;  
		}
	}
	
		
	
  
    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
		  
	   	   var point0 = vec3.fromValues(vertexArray[vid*3], vertexArray[vid*3+1], vertexArray[vid*3+2]);	
           var point1 = vec3.fromValues(vertexArray[(vid+1)*3], vertexArray[(vid+1)*3+1], vertexArray[(vid+1)*3+2]);	
           var point2 = vec3.fromValues(vertexArray[(vid+n+1)*3], vertexArray[(vid+n+1)*3+1], vertexArray[(vid+n+1)*3+2]);	

	       var normalvector = vec3.create();
	       vec3.sub(point1,point1,point0);
           vec3.sub(point2,point2,point0);
	   	   vec3.cross(normalvector,point1,point2);
		
	   	   normalArray[vid*3] += normalvector[0];
	   	   normalArray[vid*3+1] += normalvector[1];
	   	   normalArray[vid*3+2] += normalvector[2];
	   	   normalArray[(vid+1)*3] += normalvector[0];
	       normalArray[(vid+1)*3+1] += normalvector[1];
	       normalArray[(vid+1)*3+2] += normalvector[2];
	       normalArray[(vid+n+1)*3] += normalvector[0];
	   	   normalArray[(vid+n+1)*3+1] += normalvector[1];
	       normalArray[(vid+n+1)*3+2] += normalvector[2];

           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);

           var point0 = vec3.fromValues(vertexArray[(vid+1)*3], vertexArray[(vid+1)*3+1], vertexArray[(vid+1)*3+2]);	
           var point1 = vec3.fromValues(vertexArray[(vid+1+n+1)*3], vertexArray[(vid+1+n+1)*3+1], vertexArray[(vid+1+n+1)*3+2]);	
           var point2 = vec3.fromValues(vertexArray[(vid+n+1)*3], vertexArray[(vid+n+1)*3+1], vertexArray[(vid+n+1)*3+2]);	

	       var normalvector = vec3.create();
	       vec3.sub(point1,point1,point0);
	       vec3.sub(point2,point2,point0);
	       vec3.cross(normalvector,point1,point2);
           vec3.normalize(normalvector, normalvector);
           normalArray[(vid+1)*3] += normalvector[0];
	       normalArray[(vid+1)*3+1] += normalvector[1];
           normalArray[(vid+1)*3+2] += normalvector[2];
	       normalArray[(vid+1+n+1)*3] += normalvector[0];
           normalArray[(vid+1+n+1)*3+1] += normalvector[1];
           normalArray[(vid+1+n+1)*3+2] += normalvector[2];
	   	   normalArray[(vid+n+1)*3] += normalvector[0];
	       normalArray[(vid+n+1)*3+1] += normalvector[1];
	       normalArray[(vid+n+1)*3+2] += normalvector[2];

           numT+=2;
       }	
      
    return numT;
}

/**
 * Alters the verticies in the items array by the diamond square algoritm (recursivley)
 * @param {number} n number of iterations of recusive calls
 * @param {Array} items 2d array of just z values of vertex array of plane
 * @param {number} blx index of bottom left x corrdiante of working section of plane
 * @param {number} bly index of bottom left  y corrdiante of working section of plane
 * @param {number} brx index of bottom right x corrdiante of working section of plane
 * @param {number} bry index of bottom right y corrdiante of working section of plane
 * @param {number} tlx index of top left x corrdiante of working section of plane
 * @param {number} tly index of top left y corrdiante of working section of plane
 * @param {number} trx index of top right x corrdiante of working section of plane
 * @param {number} trY index of top right y corrdiante of working section of plane
 */
function diamond_square(n, items, blx, bly, brx, bry, tlx, tly, trx, trY)
{
     if(n == 0)
	return;
     var center_x = blx+((brx-blx)/2);
     var center_y = bly+((tly-bly)/2);
     var avg = (items[blx][bly] + items[brx][bry] + items[tlx][tly] + items[trx][trY])/3 + (Math.random() - Math.random())/14;
     items[center_x][center_y] = avg; 
     items[blx][center_y] = (items[tlx][tly] + items[center_x][center_y] + items[blx][bly])/3 + (Math.random() - Math.random())/14; 
     items[brx][center_y] = (items[trx][trY] + items[center_x][center_y] + items[brx][bry])/3 + (Math.random() - Math.random())/14; 
     items[center_x][tly] = (items[tlx][tly] + items[center_x][center_y] + items[trx][trY])/3 + (Math.random() - Math.random())/14; 
     items[center_x][bly] = (items[blx][bly] + items[center_x][center_y] + items[brx][bry])/3 + (Math.random() - Math.random())/14;	
     diamond_square(n-1, items, blx, bly, center_x, bly, blx, center_y, center_x, center_y); 
     diamond_square(n-1, items, center_x, bly, brx, bry, center_x, center_y, brx, center_y); 
     diamond_square(n-1, items, blx, center_y, center_x, center_y, tlx, tly, center_x, tly); 
     diamond_square(n-1, items, center_x, center_y, brx, center_y, center_x, tly, trx, trY); 
     
}

/**
 * Generates line values from faces in faceArray
 * @param {Array} faceArray array of faces for triangles
 * @param {Array} lineArray array of normals for triangles, storage location after generation
 */
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}


