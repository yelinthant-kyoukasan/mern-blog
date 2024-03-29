import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice';

function DashProfile() {

    const { currentUser } = useSelector(state => state.user)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [formData, setFormData] = useState({});
    const fileRef = useRef();
    const dispatch = useDispatch()

    console.log(imageUploadingProgress, imageFileUploadError)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    console.log(formData)

    const handleImage = e => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImageUrl(URL.createObjectURL(file))
        }
    }

    const uploadImage = async () => {
        // console.log("uploading image...")
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadingProgress(progress.toFixed(0))
            },
            error => {
                setImageFileUploadError(
                    'Could not upload image (File must be less than 2MB)'
                  );
                  setImageUploadingProgress(null);
                  setImage(null);
                  setImageUrl(null);
                  setImageFileUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then( downloadUrl => {
                    setImageUrl(downloadUrl)
                    setFormData({ ...formData, profilePicture: downloadUrl})
                })
            }
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(formData).length === 0) {
            return;
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateFailure(data.mssg))
            } else {
                dispatch(updateSuccess(data.user))
                setUpdateUserSuccess("User's profile updated successfully!")
            }
        } catch (error) {
            dispatch(updateFailure(data.mssg))
        }
    }

    useEffect(() => {
        if (image) {
            uploadImage();
        }
    }, [image])

    // console.log(image, imageUrl)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input type="file" accept='image/*' onChange={handleImage} ref={fileRef} hidden/>
            <div className='w-32 h-32 relative self-center cursor-pointer shadow-md overflow-hidden rounded-full'onClick={() => fileRef.current.click()}>
                { imageUploadingProgress && (
                    <CircularProgressbar value={imageUploadingProgress || 0} 
                        text={`${imageUploadingProgress}%`} 
                        strokeWidth={5} 
                        styles={{ 
                            root: {width: '100%', height: '100%', position: 'absolute', top: 0, left: 0},
                            path: {
                                stroke: `rgba(62, 152, 199, ${
                                imageUploadingProgress / 100
                            })`,     
                        }}}
                    />
                )}
                <img src={imageUrl || currentUser.profilePicture} alt="user" 
                    className={ `rounded-full w-full h-full object-cover border-8 border-[lightgray]
                    ${
                        imageUploadingProgress &&
                        imageUploadingProgress < 100 &&
                        'opacity-60'
                      }`
                } 
                />
            </div>
            {
                imageFileUploadError && (
                    <Alert color='failure'>
                        {imageFileUploadError}
                    </Alert>
                )
            }

            <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleChange}
            />
            <TextInput
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
            />
            <TextInput
            type='password'
            id='password'
            placeholder='Password'
            onChange={handleChange}
            />
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>
        </form>
        <div className='text-red-500 flex justify-between my-2'>
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign Out</span>
        </div>
        {
            updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )
        }
    </div>
  )
}

export default DashProfile