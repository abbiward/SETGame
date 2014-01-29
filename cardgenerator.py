# set card generator

import pygame as pg
import sys
import time

######## Helper functions for shapes and textures ############

def get_diamond_pointlist(x,y, width, height):
	half_width = int(.5*width)
	half_height = int(.5*height)
	pointlist = [[x+half_width,y], [x,y+half_height], [x+half_width,y+height], [x+width,y+half_height]]
	return pointlist

def get_squiggle_pointlist(x,y,width,height):
	yloc = [y, y+int(1./5*height), y+int(2./5*height), y+int(3./5*height), y+int(4./5*height), y+height]
	xloc = [x, x+int(1./5*width), x+int(.5*width), x+int(4./5*width),  x+width]
	pointlist = [
			[xloc[0],yloc[0]],
			[xloc[2],yloc[0]],
			[xloc[3],yloc[1]],
			[xloc[3],yloc[3]],
			[xloc[4],yloc[4]],
			[xloc[4],yloc[5]],
			[xloc[2],yloc[5]],
			[xloc[1],yloc[4]],
			[xloc[1],yloc[2]],
			[xloc[0],yloc[1]],
	]
	return pointlist

def add_striped_texture(x,y,color,width,height,screen):
	# stripes are defined by $num_stripes horizontal lines
	# each line needs a start and end point
	num_stripes = 10
	stripe_width = 1
	stripe_loc = range(num_stripes+2)
	stripe_loc = [int(val*1./(num_stripes+1)*height)+y for val in stripe_loc]
	for loc in stripe_loc:
		pg.draw.line(screen,color,[x,loc],[x+width,loc],stripe_width)


def get_background_pointlist(x, y, width, height, shape_fn):
	pointlist = shape_fn(x,y,width,height)
	pointlist = pointlist + [pointlist[0],(x+width,y),(x+width,y+height),(x,y+height),(x,y)]
	return pointlist
	

##########################################################################

def get_card_parameters(card_width, card_height, color, number, texture):
	# Shape parameters
	width = 70
	height = 150

	color_dict = { 'r':(250,0,0), 'g':(0,200,0), 'p':(127,0,250)
	}
	texture_dict = { 'f':0, 'e':3, 's':3} # value = texture_width
	
	### locations
	# horizontal placement:
	# 3 cards: 6s + 3w = card_width ; l1 = 2s, l2=3s+w, l3=4s+2w
	spacing3 = int((1./6)*(card_width-3*width))
	# 2 cards: 7s + 2w = card_width ; l1 = 3s, l2 = 4s+w
	spacing2 = int((1./7)*(card_width-2*width))
	locations_dict = {1:[int(card_width/2. - .5*width)],
					  2: [3*spacing2, 4*spacing2+width],
					  3: [2*spacing3, 3*spacing3+width, 4*spacing3+2*width]
					  }

	# pick the color and locations for this card
	color = color_dict[color]
	texture_width = texture_dict[texture]
	locations = locations_dict[number]

	return (width, height, color, texture_width, locations)


def generate_card(color,shape,number,texture):
	filename = color + shape + str(number) + texture + '.jpg'
	card_height = 220
	card_width = 400
	# get all the relevant info about the shapes we're going to draw
	(width, height, color, texture_width, locations) = get_card_parameters(card_width, card_height, color, number, texture)
	
	#bgcolor = 142, 255, 208 # blue/green/aquaish? 
	bgcolor = 250, 250, 250 # white/gray
	screen = pg.display.set_mode((card_width, card_height))
	screen.fill(bgcolor)

	# vertical placement:
	# 2s + h = 200 ; loc_vert = s
	location_vert = int(.5*(card_height-height))	

	## Add striped texture when appropriate
	if (texture == 's'):
		for loc in locations:
			add_striped_texture(loc,location_vert,color,width,height,screen)

	## Actually draw the shapes 
	if (shape == 'r'):
		for loc in locations:
			# recolor background to get rid of stripes that over extend shape
			bgpointlist = get_background_pointlist(loc, location_vert, width, height, get_diamond_pointlist)
			pg.draw.polygon(screen, bgcolor, bgpointlist, 0)
			pg.draw.ellipse(screen,color,(loc,location_vert,width,height),texture_width)
	elif (shape == 's'):
		for loc in locations:
			bgpointlist = get_background_pointlist(loc, location_vert, width, height, get_squiggle_pointlist)
			pg.draw.polygon(screen, bgcolor, bgpointlist, 0)
			pointlist = get_squiggle_pointlist(loc,location_vert,width,height)
			pg.draw.polygon(screen, color, pointlist, texture_width)
	elif (shape == 'd'):
		for loc in locations:
			bgpointlist = get_background_pointlist(loc, location_vert, width, height, get_diamond_pointlist)
			pg.draw.polygon(screen, bgcolor, bgpointlist, 0)
			pointlist = get_diamond_pointlist(loc,location_vert, width, height)
			pg.draw.polygon(screen, color, pointlist, texture_width)

	pg.display.flip()
	pg.image.save(screen, 'cards/'+filename)


def generate_all_cards(colors,shapes,numbers,textures):
	for color in colors:
		for shape in shapes:
			for number in numbers:
				for texture in textures:
					generate_card(color,shape,number,texture)


def main():
	colors = ['r', 'g', 'p']
	shapes = ['r', 's', 'd']
	numbers = [1,2,3]
	textures = ['f', 's', 'e']

	pg.init()
	#generate_card('p','r',1,'s')
	generate_all_cards(colors,shapes,numbers,textures)
	# test_fn()

	time.sleep(6)

if __name__ == '__main__':
	main()