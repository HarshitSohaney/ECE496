using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class rotateCube : MonoBehaviour
{
    // Initializing variables
    private float rotateSpeed = 90f;

    // Start is called before the first frame update
    void Start()
    {
        Debug.Log("Rotating Object");

    }

    // Update is called once per frame
    void Update()
    {
        // Rotates in Y axis 
        transform.Rotate(Vector3.up * rotateSpeed * Time.deltaTime);
    }
}
