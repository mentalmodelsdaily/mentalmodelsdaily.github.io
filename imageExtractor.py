import glob
import os
import shutil

# Location with subdirectories
my_path = "/Users/kjamithash/Desktop/Instagram_data/photos/"
# Location to move images to
main_dir = "/Users/kjamithash/workspace/kjamithash.github.io/img/galleryImages/"

# Get List of all images
files = glob.glob(my_path + '/**/*.jpg', recursive=True)

# For each image
for file in files:
    # Get File name and extension
    filename = os.path.basename(file)
    foldername = os.path.basename(os.path.dirname(file))
    filename=foldername + '_' + filename[:-4].replace(".", "-") + ".jpg"
    #print(filename)
    # Copy the file with os.rename
    if not os.path.exists(os.path.join(main_dir, filename)):
        shutil.copyfile(file, os.path.join(main_dir, filename))