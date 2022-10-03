# import the necessary packages
from logging import exception
from unittest import result
import numpy as np
import cv2
import imutils
from pytesseract import pytesseract
import os
import requests

def handlepic(image, applicationId): 
	try: 
		print("start-do")
		# load the image and compute the ratio of the old height
		# to the new height, clone it, and resize it
		image = cv2.imread(image)
		ratio = image.shape[0] / 900.0
		orig = image.copy()
		# image = cv2.resize(image, (0,0), fx=0.5,fy=0.5)
		image = imutils.resize(image, height = 900)

		hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

		# pk color tone
		lower_pk = np.array([10,100,20])
		upper_pk = np.array([20,255,255])
		mask = cv2.inRange(hsv, lower_pk, upper_pk)

		# Aeon color tone 
		# lower_aeon = np.array([20,10,20])
		# upper_aeon = np.array([55,255,255])
		# mask = cv2.inRange(hsv, lower_aeon, upper_aeon)

		color_picked = cv2.bitwise_and(image,image,mask=mask)
		# cv2.imshow("color_picked", color_picked)
		gray_color_picked = cv2.cvtColor(color_picked, cv2.COLOR_BGR2GRAY)
		thresh_color_picked = cv2.adaptiveThreshold(gray_color_picked, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 17,7)
		edged = thresh_color_picked
		print("color_picked")
		# show the original image and the edge detected image
		# print("STEP 1: Edge Detection")
		# cv2.imshow("Image", image)
		# cv2.imshow("Edged", edged)
		

		# find the contours in the edged image, keeping only the
		# largest ones, and initialize the screen contour
		cnts = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
		cnts = imutils.grab_contours(cnts)
		cnts = sorted(cnts, key = cv2.contourArea, reverse = True)[:5]
		# loop over the contours
		for c in cnts:
			# approximate the contour
			peri = cv2.arcLength(c, True)
			approx = cv2.approxPolyDP(c, 0.1 * peri, True)
			# if our approximated contour has four points, then we
			# can assume that we have found our screen
			if len(approx) == 4:
				screenCnt = approx
				break
		# show the contour (outline) of the piece of paper
		# print("STEP 2: Find contours of paper")
		print("screen cut 7",screenCnt)
		cv2.drawContours(image, [screenCnt], -1, (0, 255, 0), 2)
		# cv2.imshow("Outline", image)

		pts = screenCnt.reshape(4, 2)
		rect = np.zeros((4, 2), dtype = "float32")

		# the top-left point has the smallest sum whereas the
		# bottom-right has the largest sum
		s = pts.sum(axis = 1)
		rect[0] = pts[np.argmin(s)]
		rect[2] = pts[np.argmax(s)]

		# compute the difference between the points -- the top-right
		# will have the minumum difference and the bottom-left will
		# have the maximum difference
		diff = np.diff(pts, axis = 1)
		rect[1] = pts[np.argmin(diff)]
		rect[3] = pts[np.argmax(diff)]

		# multiply the rectangle by the original ratio
		rect *= ratio

		# now that we have our rectangle of points, let's compute
		# the width of our new image
		(tl, tr, br, bl) = rect
		widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
		widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
		# ...and now for the height of our new image
		heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
		heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
		# take the maximum of the width and height values to reach
		# our final dimensions
		maxWidth = max(int(widthA), int(widthB))
		maxHeight = max(int(heightA), int(heightB))
		# construct our destination points which will be used to
		# map the screen to a top-down, "birds eye" view
		dst = np.array([
			[0, 0],
			[maxWidth - 1, 0],
			[maxWidth - 1, maxHeight - 1],
			[0, maxHeight - 1]], dtype = "float32")
		# calculate the perspective transform matrix and warp
		# the perspective to grab the screen
		M = cv2.getPerspectiveTransform(rect, dst)
		warp = cv2.warpPerspective(orig, M, (maxWidth, maxHeight))
		# cv2.imshow("Result", warp)


		blur_again = cv2.GaussianBlur(warp,(5,5),0)
		gray_color_again = cv2.cvtColor(blur_again, cv2.COLOR_BGR2GRAY)
		thresh_color_again = cv2.adaptiveThreshold(gray_color_again, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11,7)
		# cv2.imshow("thresh_color_again", thresh_color_again)

		orig_label = warp.copy()

		linesP = cv2.HoughLinesP(thresh_color_again, 1, np.pi / 180, 150)
		# print("linesP[0]", linesP[0])
		# print("linesP[1]", linesP[1])
		# print("minY", min(linesP[0][0][1],linesP[0][0][3]))
		# print("Slope", (linesP[0][0][3] - linesP[0][0][1])/(linesP[0][0][2] - linesP[0][0][0]))
		if linesP is not None:
			for i in range(0, len(linesP)):
				l = linesP[i][0]
				if ((abs((l[3]-l[1])/(l[2]-l[0])) < 0.1) and ( maxHeight*1/5 < min(l[1],l[3]) < maxHeight*2/3)):
					cv2.line(orig_label, (l[0], l[1]), (l[2], l[3]), (0,0,255), 3, cv2.LINE_AA)
				else:
					cv2.line(orig_label, (l[0], l[1]), (l[2], l[3]), (255,0,0), 3, cv2.LINE_AA)

		# cv2.imshow("Cut_line", orig_label)

		if linesP is not None:
			for i in range(0, len(linesP)):
				l = linesP[i][0]
				if ((abs((l[3]-l[1])/(l[2]-l[0])) < 0.1) and ( maxHeight*1/4 < min(l[1],l[3]) < maxHeight*2/3)):
					cv2.line(orig_label, (l[0], l[1]), (l[2], l[3]), (0,0,255), 3, cv2.LINE_AA)
					print("red", l)
					cutY = max(l[1],l[3])
					break

		copied_warp = warp.copy()
		warp_upper = copied_warp[0:cutY, 0:maxWidth]
		final_lower = copied_warp[cutY+1:maxHeight, 0:maxWidth]

		# cv2.imshow("warp_upper",warp_upper)
		# cv2.imshow("warp_lower",warp_lower)

		# cv2.imwrite("20210810_pk9_upper.tiff",warp_upper)
		lower_filepath = os.path.join('uploads', applicationId + '_lower.png')
		cv2.imwrite(lower_filepath,final_lower)

		warp_upper_gray = cv2.cvtColor(warp_upper, cv2.COLOR_BGR2GRAY)
		warp_upper_thresh = cv2.threshold(warp_upper_gray, 0, 255,
			cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
		# cv2.imshow("Otsu", warp_upper_thresh)

		# apply a distance transform which calculates the distance to the
		# closest zero pixel for each pixel in the input image
		dist = cv2.distanceTransform(warp_upper_thresh, cv2.DIST_L2, 5)
		# normalize the distance transform such that the distances lie in
		# the range [0, 1] and then convert the distance transform back to
		# an unsigned 8-bit integer in the range [0, 255]
		dist = cv2.normalize(dist, dist, 0, 1.0, cv2.NORM_MINMAX)
		dist = (dist * 255).astype("uint8")
		# cv2.imshow("Dist", dist)
		# threshold the distance transform using Otsu's method
		dist = cv2.threshold(dist, 0, 255,
			cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
		# cv2.imshow("Dist Otsu", dist)

		# apply an "opening" morphological operation to disconnect components
		# in the image
		kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (1, 1))
		opening = cv2.morphologyEx(dist, cv2.MORPH_OPEN, kernel)
		# cv2.imshow("Opening", opening)

		# find contours in the opening image, then initialize the list of
		# contours which belong to actual characters that we will be OCR'ing
		cnts = cv2.findContours(opening.copy(), cv2.RETR_EXTERNAL,
			cv2.CHAIN_APPROX_SIMPLE)
		cnts = imutils.grab_contours(cnts)
		chars = []
		# loop over the contours
		for c in cnts:
			# compute the bounding box of the contour
			(x, y, w, h) = cv2.boundingRect(c)
			# check if contour is at least 35px wide and 100px tall, and if
			# so, consider the contour a digit
			if w >= 5 and h >= 10:
				chars.append(c)


		# compute the convex hull of the characters
		chars = np.vstack([chars[i] for i in range(0, len(chars))])
		hull = cv2.convexHull(chars)
		# allocate memory for the convex hull mask, draw the convex hull on
		# the image, and then enlarge it via a dilation
		mask = np.zeros(warp_upper_thresh.shape[:2], dtype="uint8")
		cv2.drawContours(mask, [hull], -1, 255, -1)
		mask = cv2.dilate(mask, None, iterations=2)
		# cv2.imshow("Mask", mask)
		# take the bitwise of the opening image and the mask to reveal *just*
		# the characters in the image
		final_uppper = cv2.bitwise_and(opening, opening, mask=mask)

		# cv2.imshow("Final", final)
		upper_filepath = os.path.join('uploads', applicationId + '_upper.png')
		cv2.imwrite(upper_filepath,final_uppper)

		url = 'https://tonyfok.me/yolo'
		response = requests.post(url, files={'file': open(upper_filepath, 'rb')})
		result = response.json()
		print("result:", result)
		print("result type:", type(result))
		price = result['final_result']


		# cv2.waitKey(0)
		# cv2.destroyAllWindows()

		upper_image = cv2.imread(upper_filepath)
		options = ""
		price2 = pytesseract.image_to_string(upper_image, config= "outputbase digits")
		print("Price from ivan:",price2)
		
		
		#Define path to tessaract.exe
		path_to_tesseract = r'/usr/bin/tesseract'
		# path_to_tesseract = r'/opt/homebrew/Cellar/tesseract/5.2.0/bin/tesseract'
		 
		#Point tessaract_cmd to tessaract.exe
		pytesseract.tesseract_cmd = path_to_tesseract
		lower_image = cv2.imread(lower_filepath)
		text = pytesseract.image_to_string(lower_image, lang="chi_tra+eng")
		print("text:",text)
		description	= text 

		
		return {'price': price, 'description': description}

	except(exception):
		print('error exists')
		return {'cannot regonize image'}