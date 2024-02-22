from kubernetes import client, config
import sys

def update_secret_value(new_value):
    try:
        config.load_kube_config()  # Load kubeconfig from default location
        core_v1 = client.CoreV1Api()

        namespace = "sparrow-prod"
        secret_name = "REDIS_HOST"
        key = "your-key"

        secret = core_v1.read_namespaced_secret(secret_name, namespace)
        secret.data[key] = new_value.encode('utf-8')

        core_v1.replace_namespaced_secret(secret_name, namespace, secret)

        print(f"Value of {key} in secret {secret_name} updated")
    except Exception as e:
        print('Error updating secret:', e)
        exit(1)  # Terminate with error status

if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(1)
    new_value = sys.argv[1]
    update_secret_value(new_value)
