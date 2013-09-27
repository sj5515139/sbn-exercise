==========
INSTALL
==========
mkdir exercise-home
cd exercise-home
virtualenv --distribute venv
git clone https://github.com/soby/sbn-exercise.git
source venv/bin/activate
pip install -r sbn-exercise/requirements.txt

==========
RUNNING LOCALLY
==========
cd sbn-exercise
export DJANGO_SETTINGS_MODULE=settings
python manage.py runserver

You can then open a browser to http://localhost:8000


=========
Creating a heroku test application
=========
# download the heroku toolbelt at https://toolbelt.heroku.com/
# You generally only need to login once
heroku login
# This step will give you an application name and a URL at which your app lives
heroku create
heroku keys:add
git push heroku master


========
Uploading changes to your heroku test application
========
# run any appropriate "git commit" commands
# I'd recommend doing "git add <files>" manually or you inevitably end up with a bunch of crap in your repo
# Then do "git commit <filename[s]>" or "git commit -a -m 'committing all local changes'".
git push heroku master



