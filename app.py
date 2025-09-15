from flask import Flask
app = Flask(__name__, template_folder="templates", static_folder="static", static_url_path="/static")
app.url_map.strict_slashes = False
from flask import render_template, request, redirect, url_for, session,jsonify

users=[]
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        data = request.get_json()
        new_list={"Name":data.get("name"),"email":data.get("email"),"password":data.get("password")}
        users.append(new_list)
        print(users)
        return jsonify({"success": True})
        
    return render_template("register.html")

@app.route("/dashboard")
def dashboard():
        return render_template("patient_dashboard.html")

@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        new_list={"email":data.get("email"),"password":data.get("password")}
        users.append(new_list)
        print(users)
        return jsonify({"success": True})
        
    return render_template("login.html")

@app.route("/doctor_dashboard")
def doctor_dashboard():
        return render_template("DoctorDashboard.html")
if __name__ == "__main__":
    print("\nRegistered routes:\n", app.url_map, "\n")
    app.run(debug=True)
    
print(users)
