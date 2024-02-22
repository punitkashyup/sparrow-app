const k8s = require('@kubernetes/client-node');

async function updateSecretValue(newValue) {
  try {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

    const namespace = "your-namespace";
    const secretName = "your-secret-name";
    const key = "your-key";
    
    const { body: secret } = await k8sApi.readNamespacedSecret(secretName, namespace);

    secret.data[key] = Buffer.from(newValue).toString('base64');

    await k8sApi.replaceNamespacedSecret(secretName, namespace, secret);

    console.log(`Value of ${key} in secret ${secretName} updated`);
  } catch (err) {
    console.error('Error updating secret:', err);
    process.exit(1); // Terminate with error status
  }
}

// Usage: node your_script.js <new_value>
if (process.argv.length !== 3) {
  console.error("Usage: node your_script.js <new_value>");
  process.exit(1);
}

const newValue = process.argv[2];
updateSecretValue(newValue);
