using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class NewBehaviourScript : MonoBehaviour
{
    // Initializing Variables
    public float moveSpeed = 1f;
    private Vector3 startPosition;

    // Start is called before the first frame update
    void Start()
    {
        startPosition = transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        float sin = Mathf.Sin(Time.time * moveSpeed) * 0.5f + 0.5f;
        transform.position = startPosition + Vector3.up * sin;
    }
}
