# User API Documentation

## Endpoints

### Create User

- **POST** `/users`
- **Description**: Create a new user
- **Request Body**: `CreateUserDto`
- **Response**: `UserResponseDto`

#### Required Fields:

- `age` (number, 28-32)
- `heightCm` (number, 100-250)
- `weightKg` (number, 30-200)
- `comfortableBikiniChallenges` (boolean)
- `understandsPrivateShow` (boolean)
- `understandsNoCompensation` (boolean)
- `confirmsTruthful` (boolean)

#### Optional Fields:

- `fullName` (string)
- `email` (string, unique)
- `whatsappNumber` (string)
- `gender` (enum: MALE, FEMALE)
- `cityOfResidence` (enum: BARRANQUILLA, SANTA_MARTA, CARTAGENA, MEDELLIN, BOGOTA, OTHER)
- `cityOther` (string, required if cityOfResidence is OTHER)
- `englishProficiency` (enum: YES, SOMEWHAT, NO)
- `isSingleAndAvailable` (boolean)
- `comfortableFilming` (boolean)
- `traditionalWantsMarriage` (boolean)
- `willingToCompete` (boolean)
- `children` (enum: NO, YES_1, YES_2_PLUS)
- `willingLieDetector` (boolean)
- `consentForMedia` (boolean)
- `personalityThreeWords` (string)
- `relationshipGoals` (string)
- `attractionToOlderMen` (string)
- `whyGoodWife` (string)
- `talentsOrHobbies` (string)
- `photo1` (string, Cloudinary URL)
- `photo2` (string, Cloudinary URL)
- `photo3` (string, Cloudinary URL)
- `introVideo` (string, Cloudinary URL)
- `socialMediaLinks` (string)

### Update User Photos

- **PUT** `/users/:id/photos`
- **Description**: Update user photos with Cloudinary URLs
- **Parameters**: `id` (number)
- **Request Body**:

```json
{
  "photo1": "https://res.cloudinary.com/...",
  "photo2": "https://res.cloudinary.com/...",
  "photo3": "https://res.cloudinary.com/..."
}
```

- **Response**: `UserResponseDto`

### Update User Video

- **PUT** `/users/:id/video`
- **Description**: Update user intro video with Cloudinary URL
- **Parameters**: `id` (number)
- **Request Body**:

```json
{
  "videoUrl": "https://res.cloudinary.com/..."
}
```

- **Response**: `UserResponseDto`

### Get All Users

- **GET** `/users`
- **Description**: Get all users
- **Response**: `UserResponseDto[]`

### Get User by ID

- **GET** `/users/:id`
- **Description**: Get a specific user by ID
- **Parameters**: `id` (number)
- **Response**: `UserResponseDto`

## File Upload Endpoints

### Upload Image

- **POST** `/upload/image`
- **Description**: Upload image to Cloudinary
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (image file)
- **File Limits**: 10MB max, formats: jpg, jpeg, png, gif, webp
- **Response**:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "message": "Image uploaded successfully"
}
```

### Upload Video

- **POST** `/upload/video`
- **Description**: Upload video to Cloudinary
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (video file)
- **File Limits**: 100MB max, formats: mp4, avi, mov, wmv, flv, webm
- **Response**:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "message": "Video uploaded successfully"
}
```

## Validation Rules

1. **Age**: Must be between 28 and 32
2. **Height**: Must be between 100 and 250 cm
3. **Weight**: Must be between 30 and 200 kg
4. **Email**: Must be unique if provided
5. **City**: If `cityOfResidence` is `OTHER`, `cityOther` is required
6. **Photos**: Must be valid Cloudinary URLs
7. **Video**: Must be valid Cloudinary URL

## Error Responses

- `400 Bad Request`: Validation errors or invalid data
- `409 Conflict`: Email already exists
- `404 Not Found`: User not found (for GET by ID)
- `413 Payload Too Large`: File too large
- `415 Unsupported Media Type`: Invalid file type

## Example Request

```json
{
  "fullName": "Jane Doe",
  "age": 30,
  "email": "jane@example.com",
  "whatsappNumber": "+1234567890",
  "gender": "FEMALE",
  "cityOfResidence": "BARRANQUILLA",
  "englishProficiency": "YES",
  "heightCm": 165,
  "weightKg": 60,
  "isSingleAndAvailable": true,
  "comfortableFilming": true,
  "traditionalWantsMarriage": true,
  "willingToCompete": true,
  "children": "NO",
  "willingLieDetector": true,
  "consentForMedia": true,
  "personalityThreeWords": "Fun, Caring, Ambitious",
  "relationshipGoals": "Long-term marriage",
  "attractionToOlderMen": "Maturity and stability",
  "whyGoodWife": "Loving and supportive",
  "talentsOrHobbies": "Cooking, dancing, languages",
  "comfortableBikiniChallenges": true,
  "photo1": "https://res.cloudinary.com/...",
  "photo2": "https://res.cloudinary.com/...",
  "photo3": "https://res.cloudinary.com/...",
  "introVideo": "https://res.cloudinary.com/...",
  "socialMediaLinks": "instagram.com/jane, facebook.com/jane",
  "understandsPrivateShow": true,
  "understandsNoCompensation": true,
  "confirmsTruthful": true
}
```
