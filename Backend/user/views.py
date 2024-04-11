import datetime
import jwt
from decouple import AutoConfig
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import Response


from .models import User  # Your custom User model
from .serializers import UserSerializer

config = AutoConfig()

@api_view(["POST"])
def postRegister(request):
    print("Request data:", request.data)
    serializer = UserSerializer(data=request.data)

    # Check for existing username or email in other users
    errors = {}
    if User.objects.filter(username=request.data.get("username", "")).exists():
        errors['username'] = "Username already exists!"
    if User.objects.filter(email=request.data.get("email", "")).exists():
        errors['email'] = "Email already exists!"

    if not serializer.is_valid():
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=400)

    serializer.save()
    return Response(serializer.data)

@api_view(["POST"])
def postLogin(request):
    user_username = request.data["username"]
    user_password = request.data["password"]

    # Assuming here you want to use the custom User model, adjust as needed
    user = User.objects.filter(username=user_username).first()
    # print all users
    all_users = User.objects.all()
    print("All users:", all_users)        
    print("User:", user)

    if user is None:
        raise AuthenticationFailed("User not found!")
    if not user.check_password(user_password):
        raise AuthenticationFailed("Incorrect password!")

    payload = {
        "id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
        "iat": datetime.datetime.utcnow(),
    }
    token = jwt.encode(payload, config("DJANGO_JWT_SECRET"), algorithm="HS256")
    response = Response()
    response.set_cookie(key="jwt", value=token, httponly=True)
    response.data = {"jwt": token}
    return response

@api_view(["GET"])
def getUser(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Unauthenticated!")
    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")
    user = User.objects.filter(id=payload["id"]).first()
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(["GET"])
def getLogout(request):
    response = Response()
    response.delete_cookie("jwt")
    response.data = {"message": "success"}
    return response

@api_view(["PATCH"])
def patchUpdate(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Not authenticated!")

    try:
        payload = jwt.decode(token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = User.objects.filter(id=payload["id"]).first()
    if not user:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    # Check for existing username or email in other users
    errors = {}
    if User.objects.filter(username=request.data.get("username", "")).exclude(id=user.id).exists():
        errors['username'] = "Username already exists!"
    if User.objects.filter(email=request.data.get("email", "")).exclude(id=user.id).exists():
        errors['email'] = "Email already exists!"

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(instance=user, data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def getDeleteLogged(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Not authenticated!")
    else:
        try:
            payload = jwt.decode(
                token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")
        user = User.objects.filter(id=payload["id"]).first()
        user.delete()
        response = {
            "message": "User successfully deleted!",
            "status": status.HTTP_200_OK,
        }
        return Response(response)



# for debugging
@api_view(["POST"])
def postDelete(request, id):
    user = User.objects.filter(id=id).first()
    if not user:
        response = {
            "message": "User not found!",
            "status": status.HTTP_404_NOT_FOUND,
        }
        return Response(response)

    user.delete()
    response = {
        "message": "User successfully deleted!",
        "status": status.HTTP_200_OK,
    }
    return Response(response)

# api that just verifies for a Logged user if the  password he enetrs is correct(I want to use
# this api when a user wants to change his password, so I want to verify if the old password is)
@api_view(["POST"])
def postCheckPassword(request):
    token = request.COOKIES.get("jwt")
    if not token:
        raise AuthenticationFailed("Not authenticated!")
    else:
        try:
            payload = jwt.decode(
                token, config("DJANGO_JWT_SECRET"), algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated!")
        user = User.objects.filter(id=payload["id"]).first()


        if not user.check_password(request.data["password"]):
            raise AuthenticationFailed("Incorrect password!")
        #make the respnse true or false
        response = {
            "message": "Correct password!",
            "status": status.HTTP_200_OK,
        }
        return Response(response)
    